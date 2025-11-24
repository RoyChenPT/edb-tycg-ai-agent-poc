# AI Document Inspection Assistant (edb-tycg-ai-agent-poc)

這是一個使用 Google Gemini AI 來檢查與分析文件的 Node.js 專案。支援多種檔案格式，包含 PDF, DOCX, DOC, TXT 以及圖片檔。

## 快速開始 (Quick Start)

### 1. 安裝依賴 (Install Dependencies)

確保您已安裝 Node.js (建議 v20+)。

```bash
npm install
```

### 2. 設定環境變數 (Configure Environment Variables)

複製範例設定檔並重新命名為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入您的 Google Gemini API Key 與其他設定。

### 3. 準備 Prompt 檔案

建立一個文字檔 (例如 `prompt.txt`)，填入您希望 Gemini AI 執行的指令。

### 4. 執行程式 (Run the Application)

編譯 TypeScript 程式碼：

```bash
npm run build
```

執行程式：

```bash
node dist/main.js
```

或者使用 `ts-node` 直接執行 (開發用)：

```bash
npx ts-node src/main.ts
```

## .env 配置說明

| 變數名稱 | 說明 | 範例 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | **(必填)** Google Gemini API 金鑰。 | `AIzaSy...` |
| `TARGET_FILE_PATH` | **(必填)** 要檢查的目標檔案路徑 (支援相對或絕對路徑)。 | `assets/document.pdf` |
| `PROMPT_FILE_PATH` | **(必填)** 包含 Prompt 指令的文字檔路徑。 | `prompt.txt` |
| `GEMINI_MODEL` | (選填) 指定使用的 Gemini 模型版本。預設為 `gemini-1.5-flash`。 | `gemini-1.5-pro` |

## 支援檔案格式

- **PDF**: `.pdf` (直接傳送給 AI)
- **Word**: `.docx` (透過 mammoth 解析文字), `.doc` (透過 word-extractor 解析文字)
- **純文字**: `.txt`, `.json`, `.md` 等
- **圖片**: `.jpg`, `.png`, `.jpeg`, `.webp`, `.heic`, `.heif` (直接傳送給 AI)

## 注意事項

- 對於 `.doc` 與 `.docx` 檔案，程式會先在本地端擷取文字內容後，再傳送給 Gemini AI。
- 對於 PDF 與圖片，程式會直接將檔案以 Binary 方式傳送給 Gemini AI 進行處理。
