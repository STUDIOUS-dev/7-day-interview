ATS_SYSTEM_PROMPT = "You are an expert technical recruiter and ATS system."

ATS_USER_PROMPT_TEMPLATE = """
Evaluate this resume against the job posting below.

JOB TITLE: {job_title}
JOB DESCRIPTION: {job_description}
REQUIRED SKILLS: {requirements}

RESUME TEXT:
{resume_text}

Scoring criteria:
- Skills match (40 points): How many required skills appear in the resume?
- Experience relevance (30 points): Is past experience relevant to this role?
- Education/credentials (15 points): Does education meet the role's needs?
- Communication quality (15 points): Is the resume clear, structured, specific?

Respond with ONLY a valid JSON object. No text before or after.
No markdown fences.
{{
  "score": integer between 0 and 100,
  "skills_matched": list of matched skill strings,
  "skills_missing": list of required skills absent from resume,
  "summary": "2-3 sentences explaining the score for the recruiter",
  "candidate_feedback": "1-2 sentences of constructive advice for the candidate"
}}
"""
