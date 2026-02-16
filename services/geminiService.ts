
import { GoogleGenAI, Type } from "@google/genai";
import { StudentData, PredictionResult, StudyPlanItem } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getPrediction = async (data: StudentData): Promise<PredictionResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict student performance and provide analysis based on these metrics: 
    Study Hours: ${data.studyHours}, Sleep Hours: ${data.sleepHours}, Attendance: ${data.attendance}%, 
    Previous Marks: ${data.prevMarks}, Assignment Rate: ${data.assignmentRate}%, Internet Usage: ${data.internetUsage}, 
    Stress Level: ${data.stressLevel} (1-10), Goal Marks: ${data.goalMarks}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictedMarks: { type: Type.NUMBER },
          grade: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          analysis: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["predictedMarks", "grade", "riskLevel", "analysis", "strengths", "weaknesses", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const generateStudyPlan = async (data: StudentData, prediction: PredictionResult): Promise<StudyPlanItem[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Generate a detailed 7-day study plan for a student. 
  Performance Level: ${prediction.grade}, Risk: ${prediction.riskLevel}, Goal: ${data.goalMarks}. 
  The student has ${data.studyHours} current study hours and a stress level of ${data.stressLevel}. 
  Tailor the intensity: ${prediction.riskLevel === 'High' ? 'Intensive focus on basics' : prediction.riskLevel === 'Medium' ? 'Balanced reinforcement' : 'Advanced strategic growth'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  focus: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};
