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
left null.

Usage:
    python3 scripts/import_exercises.py /path/to/exercises.json
"""
import json
import os
import sys
import urllib.request

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


ENV = load_env(os.path.join(REPO_ROOT, "backend", ".env"))
SUPABASE_URL = ENV["SUPABASE_URL"]
SERVICE_KEY = ENV["SUPABASE_SERVICE_ROLE_KEY"]

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


def api_request(method, path, body=None, prefer=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
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


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} /path/to/exercises.json", file=sys.stderr)
        sys.exit(1)

    with open(sys.argv[1]) as f:
        data = json.load(f)

    categories = get_category_ids()
    print(f"Loaded {len(categories)} workout categories: {list(categories)}")

    uncategorized = set()
    rows = []
    for e in data:
        category_name = TARGET_TO_CATEGORY.get(e["target"])
        if not category_name:
            uncategorized.add(e["target"])
        rows.append(
            {
                "external_id": e["id"],
                "name": e["name"],
                "workout_category_id": categories.get(category_name),
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
