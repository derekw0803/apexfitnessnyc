#!/usr/bin/env python3
"""
One-time import: an exported nutrition-plan HTML file (structure: an
embedded `const weeks = [...]` JS array, weeks -> days -> meals) into
Supabase public.nutrition_plans / _weeks / _days / _meals.

The plan data is JS object-literal syntax (unquoted keys, JS-specific
escaping), not strict JSON, so extraction shells out to `node` to evaluate
the array and print it as real JSON rather than hand-rolling a parser for
that syntax.

Usage:
    python3 scripts/import_nutrition_plan.py /path/to/plan.html "Plan Name" ["Plan description"]
"""
import json
import os
import re
import subprocess
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


def extract_weeks_array(html_path):
    with open(html_path, encoding="utf-8") as f:
        html = f.read()

    # Grab everything between "const weeks = [" and the matching
    # "]; // end weeks array" marker this generator's output uses.
    m = re.search(r"const weeks = (\[.*?\]);\s*//\s*end weeks array", html, re.DOTALL)
    if not m:
        raise SystemExit(
            "Could not find 'const weeks = [...]; // end weeks array' in the file. "
            "This script is written for that specific export format — inspect the "
            "file's <script> block and adjust the regex if the format differs."
        )

    js_array = m.group(1)
    result = subprocess.run(
        ["node", "-e", f"const weeks = {js_array}; console.log(JSON.stringify(weeks));"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise SystemExit(f"node failed to evaluate the weeks array:\n{result.stderr}")

    return json.loads(result.stdout)


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


def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} /path/to/plan.html \"Plan Name\" [\"description\"]", file=sys.stderr)
        sys.exit(1)

    html_path, plan_name = sys.argv[1], sys.argv[2]
    description = sys.argv[3] if len(sys.argv) > 3 else None

    weeks = extract_weeks_array(html_path)
    print(f"Parsed {len(weeks)} weeks from {html_path}")

    plan = api_request(
        "POST",
        "nutrition_plans",
        body={"name": plan_name, "description": description},
        prefer="return=representation",
    )
    plan_id = plan[0]["id"]
    print(f"Created plan '{plan_name}' ({plan_id})")

    total_days = 0
    total_meals = 0
    for week_num, week in enumerate(weeks, start=1):
        week_row = api_request(
            "POST",
            "nutrition_plan_weeks",
            body={
                "plan_id": plan_id,
                "week_number": week_num,
                "phase": week.get("phase"),
                "phase_description": week.get("phaseDesc"),
            },
            prefer="return=representation",
        )
        week_id = week_row[0]["id"]

        for day_num, day in enumerate(week.get("days", []), start=1):
            day_row = api_request(
                "POST",
                "nutrition_plan_days",
                body={"week_id": week_id, "day_number": day_num, "theme": day.get("theme")},
                prefer="return=representation",
            )
            day_id = day_row[0]["id"]
            total_days += 1

            meal_rows = []
            for meal in day.get("meals", []):
                ingredients = [
                    {"name": ing[0], "amount": ing[1]} for ing in meal.get("ingredients", [])
                ]
                meal_rows.append(
                    {
                        "day_id": day_id,
                        "meal_type": meal["type"],
                        "name": meal["name"],
                        "time_of_day": meal.get("time"),
                        "kcal": meal.get("kcal"),
                        "protein_g": meal.get("p"),
                        "carbs_g": meal.get("c"),
                        "fat_g": meal.get("f"),
                        "description": meal.get("desc"),
                        "ingredients": ingredients,
                        "prep_instructions": meal.get("prep"),
                    }
                )
            if meal_rows:
                api_request("POST", "nutrition_plan_meals", body=meal_rows, prefer="return=minimal")
                total_meals += len(meal_rows)

        print(f"  week {week_num}: {len(week.get('days', []))} days")

    print(f"\nDone. 1 plan, {len(weeks)} weeks, {total_days} days, {total_meals} meals inserted.")


if __name__ == "__main__":
    main()
