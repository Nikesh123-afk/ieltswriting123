export const USER_PROMPT_TEMPLATE = `You are now going to score ONE IELTS Writing response.

### TASK DETAILS

- task_type: "{{task_type}}"        # "task1" or "task2"
- module: "{{module}}"              # "academic" or "general"
- prompt_text:
"""
{{prompt_text}}
"""

- candidate_essay:
"""
{{essay_text}}
"""

- expected word range:
- Task 1: typically 150–250 words.
- Task 2: typically 250–350+ words.

### IELTS BAND DESCRIPTORS (SUMMARY)

Use the OFFICIAL IELTS Writing band descriptors as your reference, with these simplified summaries:

Task 1 – Task Achievement (TA):
- Band 9: Fully satisfies all requirements; clear overview; key features fully developed.
- Band 7: Covers main trends/key features; clear overview; details mostly well selected.
- Band 6: Addresses requirements; overview present but may be mechanical or partial; some key features missing or underdeveloped.
- Band 5: Limited coverage of requirements; no clear overview; key features missing, inaccurate, or confused.
- Band 4 or below: Does not address task; no overview; largely irrelevant or incomplete.

Task 2 – Task Response (TR):
- Band 9: Fully addresses all parts of the task with a fully developed position and well-supported ideas.
- Band 7: Addresses all parts; clear position; main ideas are well developed and supported.
- Band 6: Addresses all parts but may be underdeveloped; position may be unclear or partially maintained.
- Band 5: Addresses task only partially; position unclear or poorly developed; main ideas limited or not supported.
- Band 4 or below: Very limited response; no clear position; largely irrelevant or extremely short.

Coherence and Cohesion (CC) (both tasks):
- Band 9: Seamless logical flow; clear paragraphing; wide range of cohesive devices used naturally.
- Band 7: Logically organizes information; clear progression; good use of cohesive devices with minor issues.
- Band 6: Information generally arranged logically with some cohesion; some faulty or mechanical cohesion; paragraphs may be underused.
- Band 5: Limited organization; ideas may not progress logically; overuse or misuse of cohesive devices; paragraphing inadequate.
- Band 4 or below: Very little control of organization; ideas are disjointed or random.

Lexical Resource (LR):
- Band 9: Wide range of vocabulary with natural and sophisticated control; very rare minor errors.
- Band 7: Sufficient range of vocabulary to discuss topics clearly; some flexibility and precision; occasional inappropriate or inaccurate word choice.
- Band 6: Adequate range; some attempt at less common vocabulary but errors may cause some awkwardness.
- Band 5: Limited range; noticeable repetition; frequent errors in word choice and collocation.
- Band 4 or below: Very basic vocabulary; frequent errors severely limit communication.

Grammatical Range and Accuracy (GRA):
- Band 9: Wide range of structures; majority of sentences error-free; minor slips only.
- Band 7: Variety of complex structures; frequent error-free sentences; errors do not impede understanding.
- Band 6: Mix of simple and complex sentences; some errors; occasional problems with complex structures.
- Band 5: Limited range; frequent grammatical errors and inaccurate structures; some difficulty for the reader.
- Band 4 or below: Very limited range; constant errors; communication is seriously hindered.

### ANALYSIS METHODOLOGY (FOLLOW THESE STEPS SYSTEMATICALLY):

Step 1: INITIAL HOLISTIC READING (No scoring yet)
- Read the entire essay without interruption
- Note overall impression: strong/adequate/weak
- Identify 3-5 main strengths
- Identify 3-5 main weaknesses
- Get a general sense of the band range (e.g., "seems like Band 6-7 range")

Step 2: DETAILED CRITERION-BY-CRITERION ANALYSIS
For EACH of the 4 criteria, work through this checklist:

a) POSITIVE FEATURES FIRST (Critical - don't skip):
   - List specific strengths (e.g., "uses 8 different cohesive devices")
   - Quote examples from the essay showing competence
   - Note what the essay DOES well against the descriptors
   
b) AREAS FOR IMPROVEMENT:
   - Count errors/issues (e.g., "12 grammatical errors in 280 words")
   - List patterns of weakness (e.g., "repetitive vocabulary for 'important'")
   - Note missing elements (e.g., "no clear overview in Task 1")
   
c) DESCRIPTOR MATCHING:
   - Compare positive + negative features against band descriptors
   - Start from middle bands (6-7) and adjust up or down
   - Find the descriptor that BEST fits the overall profile
   - Don't fixate on single errors - look at the whole picture
   
d) QUANTITATIVE ASSESSMENT:
   - Error frequency (count grammar/vocabulary errors)
   - Sentence variety (count complex vs simple sentences)
   - Vocabulary range (count unique academic/topic-specific words)
   - Task coverage (check all prompt parts addressed)
   
e) PRELIMINARY SCORE ASSIGNMENT:
   - Assign float score (e.g., 6.7) based on descriptor match
   - Apply rounding rule to get rounded_band
   - Write brief justification referencing specific evidence

Step 3: CROSS-VALIDATION & SCORE CONSISTENCY CHECK
- Calculate arithmetic mean of 4 raw scores
- Check logical alignment between criteria:
  * High vocabulary score should support coherence (hard to be coherent with limited vocabulary)
  * High grammar score should align with lexical score (related language competencies)
  * Task score should align with coherence (well-organized essays usually address task well)
- If scores seem inconsistent, re-examine the outlier criterion
- Ask: "Would 2 other examiners independently arrive at similar scores?"
- Verify: Does the essay's quality match the band level you're assigning?

Step 4: OVERALL BAND CALCULATION (OFFICIAL IELTS METHOD)
Use the OFFICIAL IELTS algorithm:

Algorithm: Arithmetic Mean with Proper Rounding
1. Take the 4 raw criterion scores (float values)
2. Calculate arithmetic mean: (TA + CC + LR + GRA) ÷ 4
3. Apply IELTS rounding to nearest 0.5:
   - x.00 to x.24 → rounds to x.0
   - x.25 to x.74 → rounds to x.5
   - x.75 to (x+1).24 → rounds to (x+1).0

Examples:
- Scores: 7.0, 7.0, 6.5, 7.0 → Mean: 6.875 → Overall: 7.0
- Scores: 7.0, 6.5, 6.5, 6.0 → Mean: 6.5 → Overall: 6.5
- Scores: 7.5, 7.0, 6.5, 7.0 → Mean: 7.0 → Overall: 7.0
- Scores: 6.0, 6.5, 6.0, 6.0 → Mean: 6.125 → Overall: 6.0
- Scores: 8.0, 7.5, 7.5, 7.0 → Mean: 7.5 → Overall: 7.5
- Scores: 6.5, 6.0, 6.0, 5.5 → Mean: 6.0 → Overall: 6.0

Important: Do NOT round individual criteria before averaging. Use raw float scores.

Step 5: EVIDENCE-BASED FEEDBACK GENERATION
- Quote 2-3 specific examples from the essay for each criterion
- Provide actionable advice (not just "improve vocabulary")
- Balance feedback: mention strengths before weaknesses
- Link feedback to band descriptors (e.g., "To reach Band 7 in GRA, you need...")
- Ensure highlights show actual text snippets from the essay
- Prioritize high-impact issues in revision plan

### SCORING & ROUNDING RULES (OFFICIAL IELTS METHOD)

CRITICAL: Follow the official IELTS scoring algorithm EXACTLY.

1. ASSIGN RAW SCORES (Float, 0.0-9.0, one decimal):
   Evaluate each criterion independently and assign a float score:
   - "task_achievement_or_response": Based on Task 1 TA or Task 2 TR descriptors
   - "coherence_and_cohesion": Based on CC descriptors
   - "lexical_resource": Based on LR descriptors
   - "grammatical_range_and_accuracy": Based on GRA descriptors
   
   Use increments of 0.5 typically (6.0, 6.5, 7.0) but can use finer gradations if needed (6.7, 7.3).

2. ROUND EACH CRITERION to nearest 0.5 for "rounded_band":
   Apply this rounding function to each criterion score:
   - If score ends in .00 to .24 → round DOWN to nearest .0 (e.g., 6.2 → 6.0)
   - If score ends in .25 to .74 → round to .5 (e.g., 6.3 → 6.5, 6.6 → 6.5)
   - If score ends in .75 to .99 → round UP to next .0 (e.g., 6.8 → 7.0)
   
   Examples:
   - 6.0 → 6.0 | 6.1 → 6.0 | 6.2 → 6.0 | 6.24 → 6.0
   - 6.25 → 6.5 | 6.3 → 6.5 | 6.5 → 6.5 | 6.6 → 6.5 | 6.74 → 6.5
   - 6.75 → 7.0 | 6.8 → 7.0 | 6.9 → 7.0 | 7.0 → 7.0

3. CALCULATE OVERALL BAND (Official IELTS Algorithm):
   Step 1: Calculate arithmetic mean of 4 RAW scores (not rounded):
           overall_raw = (TA_raw + CC_raw + LR_raw + GRA_raw) ÷ 4
   
   Step 2: Apply IELTS rounding to get overall rounded_band:
           Use same rounding rule as Step 2 above
   
   Step 3: Assign both values:
           - "overall": { "score": overall_raw, "rounded_band": overall_rounded }
   
   DO NOT average the rounded bands. Always use raw scores for the mean calculation.
   
   Example Calculations:
   - Raw: [7.0, 7.0, 6.5, 7.0] → Mean: 6.875 → Overall: 6.875 rounded to 7.0
   - Raw: [7.0, 6.5, 6.5, 6.0] → Mean: 6.5 → Overall: 6.5 rounded to 6.5
   - Raw: [6.0, 6.5, 6.0, 6.0] → Mean: 6.125 → Overall: 6.125 rounded to 6.0
   - Raw: [7.5, 7.0, 6.5, 7.0] → Mean: 7.0 → Overall: 7.0 rounded to 7.0
   - Raw: [8.0, 7.5, 7.5, 7.0] → Mean: 7.5 → Overall: 7.5 rounded to 7.5

VERIFICATION CHECKLIST:
☑ Each criterion has both "score" (raw float) and "rounded_band" (rounded to 0.5)
☑ Overall score is calculated from RAW criterion scores, not rounded ones
☑ Overall rounded_band follows the same rounding rules
☑ All scores fall within 0.0-9.0 range
☑ Scores are internally consistent and logical

### FEEDBACK REQUIREMENTS

You must produce:

1. "summary_comment":
   - 2–4 sentences summarizing the candidate's overall performance.

2. "criterion_feedback":
   - For each of:
     - "task_achievement_or_response"
     - "coherence_and_cohesion"
     - "lexical_resource"
     - "grammatical_range_and_accuracy"
   - Provide:
     - "score": float
     - "rounded_band": float
     - "comment": 2–5 sentences explaining why this band was given, referencing specific features of the essay.

3. "highlights":
   - A list of problematic spans or exact strings.
   - Each item must include:
     - "type": one of ["grammar", "vocabulary", "cohesion", "task_response", "other"]
     - "text_snippet": a short excerpt from the essay (max ~120 characters)
     - "issue_explanation": a short explanation of what is wrong and why.
     - "suggested_correction": a suggested revision in correct English.
   - Focus on 5–15 of the most educational examples.

4. "revision_plan":
   - An ordered list (2–4 items) of concrete actions.
   - Each item must include:
     - "title": short phrase (e.g., "Improve overview sentence in Task 1")
     - "description": 2–4 sentences explaining what to practice and how, using this essay as context.
     - "estimated_impact": "high", "medium", or "low".

5. "issues":
   - If the essay is extremely short, off-topic, or not in English, or if scoring is unreliable, describe it here briefly.
   - Otherwise, set this to an empty list.

6. "notes_for_teacher":
   - Free-text notes to a human IELTS teacher, if they are supervising the student. This can include:
     - borderline cases,
     - uncertainties,
     - important patterns in errors.

### JSON OUTPUT SCHEMA (STRICT)

You MUST output EXACTLY ONE JSON object, following this schema:

{
  "meta": {
    "task_type": "task1" | "task2",
    "module": "academic" | "general",
    "approx_word_count": number
  },
  "scores": {
    "task_achievement_or_response": {
      "score": float,
      "rounded_band": float
    },
    "coherence_and_cohesion": {
      "score": float,
      "rounded_band": float
    },
    "lexical_resource": {
      "score": float,
      "rounded_band": float
    },
    "grammatical_range_and_accuracy": {
      "score": float,
      "rounded_band": float
    },
    "overall": {
      "score": float,
      "rounded_band": float
    }
  },
  "feedback": {
    "summary_comment": string,
    "criterion_feedback": {
      "task_achievement_or_response": {
        "comment": string
      },
      "coherence_and_cohesion": {
        "comment": string
      },
      "lexical_resource": {
        "comment": string
      },
      "grammatical_range_and_accuracy": {
        "comment": string
      }
    },
    "highlights": [
      {
        "type": "grammar" | "vocabulary" | "cohesion" | "task_response" | "other",
        "text_snippet": string,
        "issue_explanation": string,
        "suggested_correction": string
      }
    ],
    "revision_plan": [
      {
        "title": string,
        "description": string,
        "estimated_impact": "high" | "medium" | "low"
      }
    ]
  },
  "issues": [
    string
  ],
  "notes_for_teacher": string
}

### IMPORTANT INSTRUCTIONS

- DO NOT include any text outside of the JSON.
- DO NOT include comments or explanations outside of the fields described above.
- Be consistent and careful: base scores on the content and quality of THIS essay only.
- If the essay length is far below typical (e.g., 70 words for Task 2), penalize Task Response and possibly other criteria, and mention it in "issues".

Now analyze the candidate essay and produce the JSON object.`;

export function buildUserPrompt(
  taskType: 'task1' | 'task2',
  module: 'academic' | 'general',
  promptText: string,
  essayText: string
): string {
  return USER_PROMPT_TEMPLATE
    .replace('{{task_type}}', taskType)
    .replace('{{module}}', module)
    .replace('{{prompt_text}}', promptText)
    .replace('{{essay_text}}', essayText);
}
