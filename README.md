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

- 📄 **DOCX Parsing** — Custom lexer extracts placeholders in multiple formats: `{{name}}`, `{name}`, `${name}`, `<<name>>`, `[name]`.
- 📊 **Excel Integration** — Uses Excel rows as the source data for document generation.
- 🧠 **Hybrid Field Mapping** — Exact, fuzzy, and transformer-embedding matching to map placeholders to Excel headers.
- ✅ **Validation & Review** — Shows match confidence for each field; unmatched or low-confidence fields are flagged for manual selection.
- ⚙️ **Batch Generation** — Generates up to **100 personalized DOCX files** in one workflow.
- 📦 **ZIP Export** — Packages all generated documents into a single ZIP archive.
- 🔒 **Client-Side Processing** — All processing runs in the browser. Your data never leaves your device.

---

## 🔄 How It Works

```text
        DOCX Template              Excel Dataset
              ↓                          ↓
     Placeholder Extraction        Header & Row Parsing
       (custom lexer)                    ↓
              ↓                     Row Validation
              └────────────┬─────────────┘
                           ↓
              ┌─── Field Mapping Pipeline ───┐
              │  1. Exact Match              │
              │  2. Fuzzy Match (typos)      │
              │  3. AI Semantic Match        │
              └──────────────┬───────────────┘
                             ↓
                  Review & Manual Override
                             ↓
                     Replacement Engine
                             ↓
                   Batch DOCX Generation
                             ↓
                    ZIP Export → Download
```

---

## 🧠 How Field Mapping Works

Placeholders and Excel headers rarely match perfectly, so mapping runs in **three passes**. Each pass handles only the fields the previous one couldn't match:

| Pass | Method | Handles | Example |
|---|---|---|---|
| **1. Exact** | Case-insensitive string match | Identical names | `company_name` → `Company_Name` |
| **2. Fuzzy** | Levenshtein similarity (≥ 75%) | Typos & formatting | `department` → `depament` |
| **3. AI** | Transformer embeddings + cosine similarity (≥ 50%) | Synonyms & meaning | `joining_date` → `Date of Joining` |

- **AI model:** [`all-MiniLM-L6-v2`](https://huggingface.co/Xenova/all-MiniLM-L6-v2), run in-browser via **Transformers.js**. It converts text into 384-dimensional vectors that capture meaning.
- **Why fuzzy before AI:** embedding models understand meaning, not spelling. A typo like `depament` breaks into meaningless tokens, so string similarity catches it more reliably.
- **One header, one field:** each Excel header is assigned to only one placeholder.
- **Lazy loading:** the AI model (~23 MB) loads only when exact and fuzzy passes leave fields unmatched, and is cached by the browser after the first download.
- **Graceful fallback:** if the model fails to load, exact and fuzzy results are still returned.

---

## 🛠️ Tech Stack

- **React + TypeScript**
- **PizZip + docxtemplater** — DOCX read & render
- **SheetJS (xlsx)** — Excel parsing
- **Transformers.js** — in-browser embeddings
- **JSZip + FileSaver** — ZIP export
