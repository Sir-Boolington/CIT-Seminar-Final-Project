# Mode 2 AI Evaluation Output Schema

Claude evaluates user cybersecurity decisions using the following rubric:

Decision correctness → 40 points  
Threat recognition reasoning → 25 points  
Best-practice alignment → 20 points  
Clarity of explanation → 15 points  

Total Score → 100 points

Expected JSON output format:

{
  "score": number,
  "feedback": string,
  "strengths": [],
  "weaknesses": []
}