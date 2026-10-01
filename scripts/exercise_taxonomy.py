"""
Movement-pattern ("functionality") classifier for the exercises dataset.

The dataset gives body part, target muscle and equipment, but nothing about
*how* a movement is trained. classify_movement_pattern() derives that from
the exercise name, scoped by its target muscle so a word like "extension"
means triceps work under triceps and a hinge under spine.

Rules run in order; the first match wins. Global rules (mobility, cardio,
carry, power) apply to every exercise; the rest are per muscle domain.
The pattern names must match the rows seeded in
backend/supabase/migrations/20261001000000_add_exercise_movement_patterns.sql.
"""
import re

HORIZONTAL_PUSH = "Horizontal Push"
VERTICAL_PUSH = "Vertical Push"
HORIZONTAL_PULL = "Horizontal Pull"
VERTICAL_PULL = "Vertical Pull"
SQUAT = "Squat"
HINGE = "Hinge"
LUNGE = "Lunge"
CARRY = "Carry"
ROTATION = "Rotation"
CORE_FLEXION = "Core Flexion"
CORE_STABILITY = "Core Stability"
POWER = "Power"
ISOLATION = "Isolation"
CARDIO = "Cardio"
MOBILITY = "Mobility"

MOVEMENT_PATTERNS = [
    HORIZONTAL_PUSH, VERTICAL_PUSH, HORIZONTAL_PULL, VERTICAL_PULL,
    SQUAT, HINGE, LUNGE, CARRY, ROTATION, CORE_FLEXION, CORE_STABILITY,
    POWER, ISOLATION, CARDIO, MOBILITY,
]

LEG_TARGETS = {"quads", "glutes", "hamstrings", "adductors", "abductors", "calves"}
PUSH_TARGETS = {"pectorals", "triceps", "serratus anterior"}


def _has(pattern, name):
    return re.search(pattern, name) is not None


def classify_movement_pattern(name, target):
    n = name.lower()

    # --- Global rules -------------------------------------------------
    if _has(r"\bstretch|\bpose\b|circles|lying twist|sphinx|upward facing dog|world greatest"
            r"|circular toe touch|basic toe touch|two toe touch|hug keens"
            r"|^standing pelvic tilt$|^pelvic tilt$|flexor depresor|exercise ball hug", n):
        return MOBILITY
    if target == "cardiovascular system":
        return CARDIO
    if _has(r"\bcarry\b|farmers walk", n):
        return CARRY
    if _has(r"\bclean\b(?![- ]grip)|snatch|\bjerk\b|\bswing\b|thruster|high pull\b"
            r"|tire flip|slam|throw(?! down)|chest pass|chest push|sledge hammer"
            r"|jump|plyo|clap push|hops|judo flip", n):
        return POWER
    if _has(r"burpee|mountain climber|battling ropes|ski ergometer"
            r"|wind sprints|hands bike|quick feet", n):
        return CARDIO

    # --- Core ---------------------------------------------------------
    if target == "abs":
        if _has(r"twist|pallof|russian|windmill|landmine 180|standing lift"
                r"|figure 8|spell caster|bent press", n):
            return ROTATION
        if _has(r"plank|bridge|dead bug|rollerout|wheel|fallout|body saw"
                r"|l-sit|v-sit|front lever|planche|maltese|\bflag\b|shoulder tap|inchworm", n):
            return CORE_STABILITY
        return CORE_FLEXION
    if target == "spine":
        if _has(r"extension|hyperextension|deadlift|good morning|prone leg raise", n):
            return HINGE
        return CORE_STABILITY

    # --- Legs ---------------------------------------------------------
    if target in LEG_TARGETS:
        if _has(r"push-up|push up", n):
            return HORIZONTAL_PUSH
        if _has(r"calf|toe raise|leg curl|hamstring curl|leg extension|femoral|abduct"
                r"|adduct|internal rotation|lower body rotation|monster walk"
                r"|flutter kicks|swimmer kicks|platform slide", n):
            return ISOLATION
        if _has(r"lunge|split squat|step-up|step up|curtsey|cossack|pistol"
                r"|single leg squat|one leg squat|one leg press|frankenstein", n):
            return LUNGE
        if _has(r"squat|leg (wide )?press|hack|march sit", n):
            return SQUAT
        if _has(r"deadlift|good morning|pull through|hip extension|hyper"
                r"|rack pull|bridge|hip thrust|hip lift|glute-ham|kick|leg curl", n):
            return HINGE
        if target in {"adductors", "abductors", "calves"}:
            return ISOLATION
        return SQUAT if target == "quads" else HINGE

    # --- Upper body push ----------------------------------------------
    if target in PUSH_TARGETS or target == "delts":
        if target == "delts":
            if _has(r"upright row", n):
                return VERTICAL_PULL
            if _has(r"rear delt row|\brow\b", n):
                return HORIZONTAL_PULL
        if _has(r"\bfly\b|flyes|cross-?over|pullover|raise|kickback|extension|pushdown"
                r"|skull|french press|tate press|squeeze|wipers|rotation|iron cross"
                r"|around world|cuban press|lateral bent-over|retractor|round arm|skier|hook"
                r"|deltoid rear|rear drive|elbow press|scapula|push-up plus|svend", n):
            return ISOLATION
        if _has(r"overhead|military|shoulder press|arnold|push press|behind neck"
                r"|behind head|handstand|pike|scott press|w-press|seesaw|bradford"
                r"|side press|\bdips?\b|stalder|body-up|anti gravity", n):
            return VERTICAL_PUSH
        if target == "delts":
            if _has(r"press|alternate shoulder", n) and not _has(r"floor press", n):
                return VERTICAL_PUSH
            return ISOLATION
        return HORIZONTAL_PUSH

    # --- Upper body pull ----------------------------------------------
    if target == "lats":
        if _has(r"pullover|straight arm|pushdown|arm ups|one arm against wall", n):
            return ISOLATION
        if _has(r"\brow\b", n):
            return HORIZONTAL_PULL
        return VERTICAL_PULL
    if target == "upper back":
        if _has(r"chin-up|rope climb", n):
            return VERTICAL_PULL
        if _has(r"y-raise|rear fly", n):
            return ISOLATION
        if _has(r"front lever|back lever|skin the cat|london bridge", n):
            return CORE_STABILITY
        return HORIZONTAL_PULL
    if target == "biceps":
        if _has(r"pull-ups?\b|\bchin", n):
            return VERTICAL_PULL
        return ISOLATION

    # traps, forearms, levator scapulae and anything new in the dataset.
    return ISOLATION
