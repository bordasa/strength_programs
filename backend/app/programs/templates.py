"""
Weekly templates for The Battleship program.
Each template defines which lifts are performed at which intensity on each session.
"""

# Template for 3 lifts, 3 sessions/week
TEMPLATE_3_LIFTS_3_DAYS = {
    "name": "3 Lifts - 3 Days/Week",
    "num_lifts": 3,
    "sessions_per_week": 3,
    "sessions": {
        "A": {
            "upper_body_press": "H",
            "squat": "M",
            "upper_body_pull": "L"
        },
        "B": {
            "squat": "H",
            "upper_body_pull": "M",
            "upper_body_press": "L"
        },
        "C": {
            "upper_body_pull": "H",
            "upper_body_press": "M",
            "squat": "L"
        }
    }
}

# Template for 4 lifts, 3 sessions/week
TEMPLATE_4_LIFTS_3_DAYS = {
    "name": "4 Lifts - 3 Days/Week",
    "num_lifts": 4,
    "sessions_per_week": 3,
    "sessions": {
        "A": {
            "upper_body_press": "H",
            "hip_hinge": "H",
            "upper_body_pull": "M",
            "squat": "M"
        },
        "B": {
            "upper_body_pull": "H",
            "squat": "H",
            "upper_body_press": "L",
            "hip_hinge": "L"
        },
        "C": {
            "upper_body_press": "M",
            "hip_hinge": "M",
            "upper_body_pull": "L",
            "squat": "L"
        }
    }
}

# Template for 4 lifts, 4 sessions/week
TEMPLATE_4_LIFTS_4_DAYS = {
    "name": "4 Lifts - 4 Days/Week",
    "num_lifts": 4,
    "sessions_per_week": 4,
    "sessions": {
        "A": {
            "upper_body_press": "H",
            "upper_body_pull": "M",
            "hip_hinge": "L"
        },
        "B": {
            "squat": "H",
            "hip_hinge": "M",
            "upper_body_press": "L"
        },
        "C": {
            "upper_body_pull": "H",
            "upper_body_press": "M",
            "squat": "L"
        },
        "D": {
            "hip_hinge": "H",
            "squat": "M",
            "upper_body_pull": "L"
        }
    }
}

# Template for 6 lifts, 4 sessions/week
TEMPLATE_6_LIFTS_4_DAYS = {
    "name": "6 Lifts - 4 Days/Week",
    "num_lifts": 6,
    "sessions_per_week": 4,
    "sessions": {
        "A": {
            "horz_press": "H",
            "horz_pull": "H",
            "vert_press": "M",
            "vert_pull": "M",
            "hinge": "L"
        },
        "B": {
            "squat": "H",
            "hinge": "M",
            "horz_press": "L",
            "horz_pull": "L"
        },
        "C": {
            "vert_press": "H",
            "vert_pull": "H",
            "horz_press": "M",
            "horz_pull": "M",
            "squat": "L"
        },
        "D": {
            "hinge": "H",
            "squat": "M",
            "vert_press": "L",
            "vert_pull": "L"
        }
    }
}

# Map of all available templates
TEMPLATES = {
    "3_lifts_3_days": TEMPLATE_3_LIFTS_3_DAYS,
    "4_lifts_3_days": TEMPLATE_4_LIFTS_3_DAYS,
    "4_lifts_4_days": TEMPLATE_4_LIFTS_4_DAYS,
    "6_lifts_4_days": TEMPLATE_6_LIFTS_4_DAYS
}


def get_template(num_lifts: int, sessions_per_week: int = None):
    """
    Get the appropriate template based on number of lifts and sessions per week.
    
    Args:
        num_lifts: Number of lifts (3, 4, or 6)
        sessions_per_week: Optional sessions per week (3 or 4)
    
    Returns:
        Template dictionary
    """
    if num_lifts == 3:
        return TEMPLATE_3_LIFTS_3_DAYS
    elif num_lifts == 4:
        if sessions_per_week == 4:
            return TEMPLATE_4_LIFTS_4_DAYS
        else:
            return TEMPLATE_4_LIFTS_3_DAYS
    elif num_lifts == 6:
        return TEMPLATE_6_LIFTS_4_DAYS
    else:
        raise ValueError(f"Invalid number of lifts: {num_lifts}")


def get_available_templates():
    """Get list of all available templates with metadata."""
    return [
        {
            "key": key,
            "name": template["name"],
            "num_lifts": template["num_lifts"],
            "sessions_per_week": template["sessions_per_week"]
        }
        for key, template in TEMPLATES.items()
    ]

