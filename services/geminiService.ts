import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MoodAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMood = async (text: string): Promise<MoodAnalysis> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      sentimentScore: {
        type: Type.NUMBER,
        description: "A score from 1 (extremely negative) to 10 (extremely positive) reflecting the mood of the text.",
      },
      emotionalTone: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 3-5 adjectives describing the emotional tone (e.g., Anxious, Hopeful, Frustrated).",
      },
      empatheticResponse: {
        type: Type.STRING,
        description: "A warm, empathetic, and psychological supportive paragraph responding to the user's entry.",
      },
      actionableAdvice: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 specific, small, actionable steps the user can take to improve or maintain their mood.",
      },
      colorHex: {
        type: Type.STRING,
        description: "A hex color code that visually represents the mood (e.g., #FF5733 for angry, #ADD8E6 for calm).",
      },
      shortSummary: {
        type: Type.STRING,
        description: "A very short 3-5 word summary of the entry.",
      }
    },
    required: ["sentimentScore", "emotionalTone", "empatheticResponse", "actionableAdvice", "colorHex", "shortSummary"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following journal entry from a user. Be supportive, insightful, and kind. Entry: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an empathetic AI mental health companion. Your goal is to validate feelings and offer gentle guidance.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MoodAnalysis;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for error handling
    return {
      sentimentScore: 5,
      emotionalTone: ["Neutral", "Uncertain"],
      empatheticResponse: "I'm having a little trouble connecting right now, but your feelings are valid. Please try again in a moment.",
      actionableAdvice: ["Take a deep breath", "Try analyzing again later"],
      colorHex: "#9ca3af",
      shortSummary: "Analysis Failed"
    };
  }
};