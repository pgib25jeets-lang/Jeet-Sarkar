import { GoogleGenAI } from "@google/genai";
import { AnalysisType } from "../types";

export const getStrategicInsight = async (
  analysisType: AnalysisType,
  dataContext: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "API Key not configured. Unable to generate AI insights.";
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-2.5-flash"; // Good balance for text analysis

  let systemInstruction = "You are a Chief Strategy Officer AI for a retail school-bag company. Your tone is executive, concise, and risk-aware.";
  let prompt = "";

  switch (analysisType) {
    case AnalysisType.SNAPSHOT:
      prompt = `Analyze this sales snapshot. Briefly highlight the volatility and the dominant channel.\n\nContext:\n${dataContext}`;
      break;
    case AnalysisType.TREND:
      prompt = `Analyze these trend uncertainty indicators. Is the market stabilizing or becoming more chaotic? Limit to 2 sentences.\n\nContext:\n${dataContext}`;
      break;
    case AnalysisType.SCENARIO:
      prompt = `Compare these two future scenarios (Online Surge vs Physical Recovery). Which offers better risk-adjusted returns? \n\nContext:\n${dataContext}`;
      break;
    case AnalysisType.RISK:
      prompt = `Review these risk indicators. What is the single biggest threat to the business right now?\n\nContext:\n${dataContext}`;
      break;
    case AnalysisType.FINAL_DECISION:
      systemInstruction += " Provide a final recommendation: 'Invest Online', 'Invest Offline', or 'Hybrid Pilot'. Justify with one strong data point.";
      prompt = `Based on the aggregate data below, recommend a strategic path forward.\n\nData Summary:\n${dataContext}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        // Removed maxOutputTokens to allow the model to fully utilize its thinking budget if needed
      }
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Temporary error analyzing data. Please try again.";
  }
};