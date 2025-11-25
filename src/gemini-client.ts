import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey });

export async function generateContent(prompt: string, filesData: Array<{ mimeType: string; data: Buffer | string }> = []) {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  try {
    const parts: any[] = [{ text: prompt }];

    for (const file of filesData) {
        if (Buffer.isBuffer(file.data)) {
            parts.push({
                inlineData: {
                    data: file.data.toString("base64"),
                    mimeType: file.mimeType,
                },
            });
        } else if (typeof file.data === 'string') {
            parts.push({ text: `\n\n[Document Content]\n${file.data}` });
        }
    }

    const response = await genAI.models.generateContent({
      model: modelName,
      contents: [
          {
              role: "user",
              parts: parts
          }
      ]
    });
    
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
