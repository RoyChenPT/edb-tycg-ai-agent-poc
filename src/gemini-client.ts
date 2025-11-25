import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey });

export async function generateContent(prompt: string, fileData?: { mimeType: string; data: Buffer }) {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  try {
    let response;
    if (fileData) {
      const imagePart = {
        inlineData: {
          data: fileData.data.toString("base64"),
          mimeType: fileData.mimeType,
        },
      };
      response = await genAI.models.generateContent({
        model: modelName,
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    imagePart
                ]
            }
        ]
      });
    } else {
      response = await genAI.models.generateContent({
        model: modelName,
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ]
      });
    }
    
    // Check response structure for @google/genai
    if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            return candidate.content.parts[0].text;
        }
    } 
    
    if (response.text) {
        return response.text;
    } else {
        return JSON.stringify(response, null, 2);
    }

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
