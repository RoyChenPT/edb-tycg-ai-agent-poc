import { readFileContent } from "./file-processor.js";
import { generateContent } from "./gemini-client.js";
import dotenv from "dotenv";

dotenv.config();

import fs from "fs/promises";

async function main() {
  const filePath = process.env.TARGET_FILE_PATH;
  const promptFilePath = process.env.PROMPT_FILE_PATH;

  if (!filePath) {
    console.error("Error: TARGET_FILE_PATH is not defined in environment variables.");
    process.exit(1);
  }

  if (!promptFilePath) {
    console.error("Error: PROMPT_FILE_PATH is not defined in environment variables.");
    process.exit(1);
  }

  let prompt;
  try {
    prompt = await fs.readFile(promptFilePath, "utf-8");
  } catch (error) {
    console.error(`Error reading prompt file ${promptFilePath}:`, error);
    process.exit(1);
  }

  console.log(`Processing file: ${filePath}`);
  console.log(`Using Model: ${process.env.GEMINI_MODEL || "gemini-1.5-flash"}`);
  console.log(`Prompt loaded from: ${promptFilePath}`);

  try {
    const { content, mimeType } = await readFileContent(filePath);

    let responseText;
    if (typeof content === 'string') {
         const fullPrompt = `${prompt}\n\nDocument Content:\n${content}`;
         responseText = await generateContent(fullPrompt);
    } else {
        // Always send as file data (Buffer)
        responseText = await generateContent(prompt, { mimeType, data: content });
    }

    console.log("\n--- Gemini AI Response ---\n");
    console.log(responseText);
    console.log("\n--------------------------\n");

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
