"""Run: python3 -m unittest discover scripts"""
import unittest

from exercise_taxonomy import (
    CARDIO, CARRY, CORE_FLEXION, CORE_STABILITY, HINGE, HORIZONTAL_PULL,
    HORIZONTAL_PUSH, ISOLATION, LUNGE, MOBILITY, POWER, ROTATION, SQUAT,
    VERTICAL_PULL, VERTICAL_PUSH, classify_movement_pattern,
)

CASES = [
    ("barbell bench press", "pectorals", HORIZONTAL_PUSH),
    ("push-up", "pectorals", HORIZONTAL_PUSH),
    ("dumbbell seated shoulder press", "delts", VERTICAL_PUSH),
    ("chest dip", "pectorals", VERTICAL_PUSH),
    ("barbell bent over row", "upper back", HORIZONTAL_PULL),
    ("lever seated row", "upper back", HORIZONTAL_PULL),
    ("barbell rear delt row", "delts", HORIZONTAL_PULL),
    ("pull-up", "lats", VERTICAL_PULL),
    ("cable pulldown", "lats", VERTICAL_PULL),
    ("barbell upright row", "delts", VERTICAL_PULL),
    ("barbell full squat", "glutes", SQUAT),
    ("barbell clean-grip front squat", "glutes", SQUAT),
    ("sled 45° leg press (side pov)", "glutes", SQUAT),
    ("trap bar deadlift", "glutes", HINGE),
    ("barbell glute bridge", "glutes", HINGE),
    ("hyperextension", "spine", HINGE),
    ("walking lunge", "glutes", LUNGE),
    ("split squats", "quads", LUNGE),
    ("farmers walk", "quads", CARRY),
    ("russian twist", "abs", ROTATION),
    ("band horizontal pallof press", "abs", ROTATION),
    ("crunch floor", "abs", CORE_FLEXION),
    ("lever seated crunch", "abs", CORE_FLEXION),
    ("assisted lying leg raise with throw down", "abs", CORE_FLEXION),
    ("weighted front plank", "abs", CORE_STABILITY),
    ("front lever", "abs", CORE_STABILITY),
    ("power clean", "hamstrings", POWER),
    ("kettlebell swing", "glutes", POWER),
    ("jump squat", "glutes", POWER),
    ("dumbbell biceps curl", "biceps", ISOLATION),
    ("smith machine bicep curl", "biceps", ISOLATION),
    ("cable high pulley overhead tricep extension", "triceps", ISOLATION),
    ("dumbbell lateral raise", "delts", ISOLATION),
    ("lever lying leg curl", "hamstrings", ISOLATION),
    ("barbell shrug", "traps", ISOLATION),
    ("burpee", "cardiovascular system", CARDIO),
    ("battling ropes", "delts", CARDIO),
    ("hamstring stretch", "hamstrings", MOBILITY),
    ("ankle circles", "calves", MOBILITY),
]


class ClassifyMovementPatternTest(unittest.TestCase):
    def test_cases(self):
        for name, target, expected in CASES:
            with self.subTest(name=name):
                self.assertEqual(classify_movement_pattern(name, target), expected)


if __name__ == "__main__":
    unittest.main()
