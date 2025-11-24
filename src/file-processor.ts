import fs from "fs/promises";
import path from "path";
import mime from "mime-types";
import mammoth from "mammoth";
import WordExtractor from "word-extractor";

export async function readFileContent(filePath: string): Promise<{ content: Buffer | string; mimeType: string }> {
  const absolutePath = path.resolve(filePath);
  const mimeType = mime.lookup(absolutePath) || "application/octet-stream";

  try {
    const fileBuffer = await fs.readFile(absolutePath);

    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") { // docx
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return { content: result.value, mimeType: "text/plain" };
    } else if (mimeType === "application/msword") { // doc
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(fileBuffer);
        return { content: extracted.getBody(), mimeType: "text/plain" };
    }

    return { content: fileBuffer, mimeType: mimeType };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}
