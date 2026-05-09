# Event Tracking Spec — Improved AI Humanizer LP

## Purpose

The improved LP should be measurable as an experiment. These events help diagnose whether users receive value before signup and where they drop.

## Recommended events

| Event | When it fires | Why it matters |
|---|---|---|
| `lp_rendered` | Page loads | Exposure baseline |
| `text_entered` | User enters text | Measures commitment |
| `sample_text_clicked` | User uses sample text | Measures blank-state support |
| `preview_requested` | User clicks preview CTA | Measures intent after paste |
| `preview_generated` | Preview appears | Measures time-to-value |
| `quiz_started` | First quiz step appears | Measures personalization start |
| `quiz_step_viewed` | A quiz step appears | Finds step-level drop-off |
| `quiz_step_completed` | Each quiz answer selected | Finds quiz drop-off |
| `preview_refined` | Refined preview appears | Measures value after quiz |
| `unlock_wall_viewed` | Signup/unlock card appears | Measures gating exposure |
| `unlock_wall_dismissed` | User dismisses/keeps editing | Measures wall friction |
| `signup_cta_clicked` | User clicks signup CTA | Primary LP conversion |

## Recommended properties

```text
variant_id
lp_name
device_type
traffic_source
ad_keyword
chars_bucket
sample_used
quiz_answers
cta_copy
wall_type
preview_visible_lines
time_to_preview_ms
```

## Key experiment readouts

- Text input rate.
- Preview generation rate.
- Quiz completion rate.
- Time to preview.
- Unlock wall view rate.
- Unlock wall → signup CTA click rate.
- Signup CVR.
- Downstream install and try rate.
