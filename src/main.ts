import { readFileContent } from "./file-processor.js";
import { generateContent } from "./gemini-client.js";
import dotenv from "dotenv";

dotenv.config();

import fs from "fs/promises";

async function main() {
  const targetPaths = process.env.TARGET_FILE_PATH || "";
  const filePaths = targetPaths.split(',').map(p => p.trim()).filter(p => p.length > 0);
  const promptFilePath = process.env.PROMPT_FILE_PATH;

  if (filePaths.length === 0) {
    console.error("Error: No valid file paths found in TARGET_FILE_PATH.");
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

  console.log(`Using Model: ${process.env.GEMINI_MODEL || "gemini-1.5-flash"}`);
  console.log(`Prompt loaded from: ${promptFilePath}`);

  const filesData: Array<{ mimeType: string; data: Buffer | string }> = [];

  for (const filePath of filePaths) {
    console.log(`Processing file: ${filePath}`);
    try {
      const { content, mimeType } = await readFileContent(filePath);
      filesData.push({ mimeType, data: content });
    } catch (error) {
      console.error(`An error occurred while reading ${filePath}:`, error);
    }
  }

  if (filesData.length === 0) {
      console.log("No files to process.");
      return;
  }

  try {
      console.log("Sending request to Gemini AI...");
      const responseText = await generateContent(prompt, filesData);

      console.log("\n--- Gemini AI Response ---\n");
      console.log(responseText);
      console.log("\n--------------------------\n");
  } catch (error) {
      console.error("An error occurred during AI generation:", error);
  }
}

main();
