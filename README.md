# 📄 Paperwork Assistant

### 🚀 Browser-Based DOCX Automation & Bulk Document Generation

**Paperwork Assistant** is a browser-based document automation engine built with **React and TypeScript** that converts a DOCX template and Excel dataset into personalized Word documents in bulk.

It automates repetitive document creation by extracting placeholders, intelligently mapping them to Excel fields, validating the mappings, and generating up to **100 personalized DOCX files** that can be downloaded as a single ZIP archive.

> **DOCX Template + Excel Data → AI-Assisted Mapping → Personalized DOCX Files → ZIP Export**

---

## 🖼️ Preview

![Paperwork Assistant](./public/paperwork-assistant.png)

---

## ✨ Features

- 📄 **DOCX Parsing** — Extracts dynamic placeholders from DOCX/XML templates.
- 📊 **Excel Integration** — Uses Excel rows as the source data for document generation.
- 🧠 **AI-Assisted Field Mapping** — Uses transformer embeddings and semantic similarity to match template placeholders with Excel headers.
- ✅ **Validation** — Detects missing, invalid, or unmapped fields before generation.
- ⚙️ **Batch Generation** — Generates up to **100 personalized DOCX files** in one workflow.
- 📦 **ZIP Export** — Packages all generated documents into a single ZIP archive.
- 🔒 **Client-Side Processing** — Core document processing runs directly in the browser with **no application backend dependency**.

---

## 🔄 How It Works

```text
             DOCX Template
                   +
              Excel Dataset
                   ↓
          Placeholder Extraction
                   ↓
          Field Normalization
                   ↓
        AI-Assisted Field Mapping
                   ↓
              Validation
                   ↓
          Replacement Engine
                   ↓
         Batch DOCX Generation
                   ↓
              ZIP Export
                   ↓
             Local Download
