# Content Redundancy Audit

Date: 2026-06-09

## Summary

The current content library is broad and structured, but many lessons still read as generated template content. The lesson objects are not exact duplicates, because topics and subjects vary, but their prose patterns are highly repetitive.

## Findings

- Total lessons: 84
- Subject distribution: 12 each for FAR, AUD, REG, BAR, ISC, TCP, and HISTORY
- Lesson titles ending in "Mastery": 84 of 84
- Normalized opening sentence patterns: 1
- Common pattern: topic-specific substitutions inside the same explanatory frame

## UX Changes Made

- The Academy now shows an all-lesson library with subject filters and search.
- Lesson display titles remove the repeated trailing "Mastery" label.
- Lessons now use subject-specific visual skins.
- Lessons rotate between four presentation modes:
  - Concept Build
  - Scenario First
  - Judgment Drill
  - Exam Transfer
- Lesson sections are now more visually distinct: core idea, concept map, terminology, scenario, prompts, TOWS, reinforcement, and quiz.

## Content Recommendation

Future content work should replace generated template paragraphs with expert-authored modules for high-value areas first:

- FAR revenue recognition, leases, bonds, consolidations, cash flows
- AUD risk assessment, internal control, evidence, sampling, reporting
- REG individual tax, entity taxation, property transactions, Circular 230
- BAR variance analysis, forecasting, financial analysis
- ISC access controls, SOC reporting, cybersecurity
- TCP entity planning, estate/gift tax, retirement planning

The app can support the deeper content now; the main remaining work is editorial quality.
