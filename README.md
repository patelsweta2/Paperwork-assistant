# 📄 Paperwork Assistant

### 🚀 Browser-Based DOCX Automation & Bulk Document Generation

**Paperwork Assistant** automates repetitive document creation by converting a DOCX template and Excel data into personalized Word documents in bulk.

> **DOCX Template + Excel Data → AI-Assisted Mapping → Personalized DOCX Files → ZIP Export**

---

## 🖼️ Preview

![Paperwork Assistant](./screenshots/paperwork-assistant.png)

---

## ✨ Features

- 📄 **DOCX Parsing** — Extracts dynamic placeholders from DOCX/XML templates.
- 📊 **Excel Integration** — Uses Excel rows as data for document generation.
- 🧠 **AI-Assisted Mapping** — Uses transformer embeddings and semantic similarity to match template fields with Excel headers.
- ✅ **Validation** — Detects missing or invalid field mappings before generation.
- ⚙️ **Batch Generation** — Generates up to **100 personalized DOCX files** in one workflow.
- 📦 **ZIP Export** — Packages generated documents into a single ZIP.
- 🔒 **Client-Side Processing** — Core processing runs in the browser with **no application backend dependency**.

---

## 🔄 How It Works

```text
     DOCX Template
           +
      Excel Dataset
           ↓
  Placeholder Extraction
           ↓
  AI-Assisted Field Mapping
           ↓
       Validation
           ↓
   DOCX Batch Generation
           ↓
       ZIP Export
