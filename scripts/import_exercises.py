#!/usr/bin/env python3
"""
One-time import: hasaneyldrm/exercises-dataset -> Supabase public.exercises.

Only the exercise DATA is imported (MIT-licensed: name, body part, target
muscle, equipment, English instructions). image_path/gif_path/attribution
are stored as reference metadata only -- the media itself is Gym visual's
copyrighted content redistributed under a permission that does not extend
to downstream reuse. Do not display these images/GIFs on the live site
without separately obtaining rights from Gym visual (https://gymvisual.com/).

Maps each exercise's `target` (falling back to `body_part`) onto one of the
5 workout_categories seeded by the schema migration. "Push/Pull" absorbs all
chest/back/arm/shoulder work; "Upper body" is left unused (see the schema
migration's note on the overlap between those two categories);
cardio has no fitting category and is imported with workout_category_id
left null. Stretches (Mobility movement pattern) go to
"Mobility/Stabilization" whatever their target muscle.

Each exercise also gets a movement pattern ("functionality") from
exercise_taxonomy.classify_movement_pattern(), stored in
exercises.movement_pattern_id.

Re-running is safe: rows upsert on external_id.

Usage:
    python3 scripts/import_exercises.py /path/to/exercises.json
    python3 scripts/import_exercises.py --dry-run /path/to/exercises.json

--dry-run classifies and prints counts without touching Supabase (no
backend/.env needed).
"""
import collections
import functools
import json
import os
import sys
import urllib.request

from exercise_taxonomy import MOBILITY, MOVEMENT_PATTERNS, classify_movement_pattern

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env(path):
    env = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


# target (preferred) or body_part (fallback) -> workout_categories.name.
# Anything not listed here (currently just "cardiovascular system" / cardio)
# is imported with no category.
TARGET_TO_CATEGORY = {
    "pectorals": "Push/Pull",
    "serratus anterior": "Push/Pull",
    "lats": "Push/Pull",
    "upper back": "Push/Pull",
    "traps": "Push/Pull",
    "biceps": "Push/Pull",
    "triceps": "Push/Pull",
    "delts": "Push/Pull",
    "forearms": "Push/Pull",
    "spine": "Mobility/Stabilization",
    "levator scapulae": "Mobility/Stabilization",
    "glutes": "Lower Body",
    "quads": "Lower Body",
    "hamstrings": "Lower Body",
    "adductors": "Lower Body",
    "abductors": "Lower Body",
    "calves": "Lower Body",
    "abs": "Core",
}


def category_for(exercise, movement_pattern):
    if movement_pattern == MOBILITY:
        return "Mobility/Stabilization"
    return TARGET_TO_CATEGORY.get(exercise["target"])


@functools.cache
def supabase_env():
    return load_env(os.path.join(REPO_ROOT, "backend", ".env"))


def api_request(method, path, body=None, prefer=None):
    env = supabase_env()
    service_key = env["SUPABASE_SERVICE_ROLE_KEY"]
    url = f"{env['SUPABASE_URL']}/rest/v1/{path}"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        raw = resp.read()
        return json.loads(raw) if raw else None


def get_category_ids():
    rows = api_request("GET", "workout_categories?select=id,name")
    return {r["name"]: r["id"] for r in rows}


def get_movement_pattern_ids():
    rows = api_request("GET", "movement_patterns?select=id,name")
    ids = {r["name"]: r["id"] for r in rows}
    missing = set(MOVEMENT_PATTERNS) - set(ids)
    if missing:
        sys.exit(
            f"movement_patterns is missing {sorted(missing)} -- apply the "
            "20261001000000_add_exercise_movement_patterns migration first."
        )
    return ids


def print_summary(classified):
    for label, key in (
        ("Category", "category"),
        ("Movement pattern", "pattern"),
        ("Body part", "body_part"),
    ):
        counts = collections.Counter(c[key] or "(none)" for c in classified)
        print(f"\n{label}:")
        for name, n in counts.most_common():
            print(f"  {n:5d}  {name}")


def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    args = [a for a in args if a != "--dry-run"]
    if len(args) != 1:
        print(f"Usage: {sys.argv[0]} [--dry-run] /path/to/exercises.json", file=sys.stderr)
        sys.exit(1)

    with open(args[0]) as f:
        data = json.load(f)

    classified = []
    for e in data:
        pattern = classify_movement_pattern(e["name"], e["target"])
        classified.append(
            {"exercise": e, "pattern": pattern, "category": category_for(e, pattern),
             "body_part": e["body_part"]}
        )

    if dry_run:
        print(f"Classified {len(classified)} exercises (dry run, nothing written).")
        print_summary(classified)
        return

    categories = get_category_ids()
    print(f"Loaded {len(categories)} workout categories: {list(categories)}")
    patterns = get_movement_pattern_ids()
    print(f"Loaded {len(patterns)} movement patterns.")

    uncategorized = set()
    rows = []
    for c in classified:
        e = c["exercise"]
        if not c["category"]:
            uncategorized.add(e["target"])
        rows.append(
            {
                "external_id": e["id"],
                "name": e["name"],
                "workout_category_id": categories.get(c["category"]),
                "movement_pattern_id": patterns[c["pattern"]],
                "body_part": e["body_part"],
                "target_muscle": e["target"],
                "secondary_muscles": e.get("secondary_muscles") or [],
                "equipment": e["equipment"],
                "instructions": e.get("instructions", {}).get("en"),
                "image_path": e.get("image"),
                "gif_path": e.get("gif_url"),
                "attribution": e.get("attribution"),
            }
        )

    print(f"Prepared {len(rows)} exercises.")
    if uncategorized:
        print(f"Uncategorized targets (imported with null category): {sorted(uncategorized)}")

    # Batch in chunks -- PostgREST/Supabase handles large arrays fine, but
    # keep requests a reasonable size rather than one 17MB payload.
    CHUNK = 200
    inserted = 0
    for i in range(0, len(rows), CHUNK):
        chunk = rows[i : i + CHUNK]
        api_request(
            "POST",
            "exercises?on_conflict=external_id",
            body=chunk,
            prefer="return=minimal,resolution=merge-duplicates",
        )
        inserted += len(chunk)
        print(f"  inserted {inserted}/{len(rows)}")

    print(f"\nDone. {inserted} exercises inserted total.")


if __name__ == "__main__":
    main()
