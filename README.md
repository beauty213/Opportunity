# ScholarEase: AI-Powered Educational Financial Assistance Platform

> **"Don't make students search endlessly for scholarships. Help the right opportunities find the right students."**

🔗 **Live Deployment**: [https://zippy-lagoon-68k8xhg.tmp.now](https://zippy-lagoon-68k8xhg.tmp.now)  
📦 **GitHub Repository**: [https://github.com/beauty213/Opportunity](https://github.com/beauty213/Opportunity)

ScholarEase is an intelligent, student-centric financial aid companion designed to eliminate the structural friction, repetitive physical trips, and high rejection rates faced by Indian higher education students when seeking scholarships, fee reimbursements, and educational grants.

Initial regional implementation: **Telangana** (ePASS Post-Matric RTF & MTF, Lateral Entry B.Tech, MeeSeva revenue verification) and **National Portals** (NSP, AICTE Pragati/Saksham, Corporate CSR), architected with modular rule schemas for easy expansion across all Indian states.

---

## 🌟 The Core Problems ScholarEase Solves

1. **Fragmented Discovery**: Students miss high-value aid because eligibility rules are buried across dozens of disparate government portals (`.cgg.gov.in`, `.gov.in`) and CSR sites.
2. **Opaque & Ambiguous Rules**: Complex criteria (income ceilings, convenor quota requirements, lateral entry acceptance, biometric attendance) lead to confusion and self-disqualification.
3. **Avoidable Physical Trips & Verification Rejections**: Students travel to college counters or district welfare offices only to be turned away because a round rubber seal, self-attestation, or an NPCI Aadhaar bank mapping is missing.
4. **Discrepancy Hazards**: Name spelling differences, unreadable barcodes on MeeSeva certificates, or unseeded bank accounts cause silent rejection after months of waiting.

---

## 🏗️ Architecture & Tech Stack

```
                          ┌─────────────────────────────────────┐
                          │    ScholarEase React 18 + TS UI     │
                          │  Tailwind CSS • Lucide • Multi-Lang │
                          └──────────────────┬──────────────────┘
                                             │ HTTP / REST
                                             ▼
                          ┌─────────────────────────────────────┐
                          │        FastAPI Python Backend       │
                          │  Deterministic Rules • RAG Copilot  │
                          └──────┬───────────┬───────────┬──────┘
                                 │           │           │
                 ┌───────────────┘           │           └────────────────┐
                 ▼                           ▼                            ▼
      ┌────────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐
      │  SQLAlchemy ORM    │     │ Deterministic Rules  │     │ Grounded RAG Copilot  │
      │ SQLite / Postgres  │     │  & Simulator Sandbox │     │ G.O. Ms. No. 66 Store │
      └────────────────────┘     └──────────────────────┘     └───────────────────────┘
```

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Vite.
  - Multi-language engine: **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.
  - Low-Bandwidth Mode: Disables heavy assets for reliable operation on 2G/3G connections.
  - Print Stylesheets: Professional print layouts for the Zero-Repeat-Visit Checklist.
- **Backend**: FastAPI, Pydantic v2 validation, SQLAlchemy 2.0.
  - Database: Dual-compatible SQLite (for instant zero-dependency local runs) and PostgreSQL (via `DATABASE_URL`).
  - Automated database seeder with authentic, verified Indian scholarship schemes and real-world student demo profiles.

---

## 📦 The 11 Core Modules

### 1. Student Profile & Reusable Financial Identity
- Collects personal, educational (Course, Branch, Year, Lateral Entry vs Regular, Diploma/Inter marks), financial (Family Income, Tuition, Hostel/Living costs), and category (BC-B, SC, ST, EWS, General).
- Generates a cryptographically verifiable **Student Financial Identity Card** (`SE-ID-XXXXX`) that students can download and reuse across institutions.

### 2. Intelligent Scholarship Discovery
- Multi-dimensional search and filtering (Provider type, State, Income limit, Marks cutoff, Lateral entry accepted, Deadline).
- Dynamic Match Score calculation (0–100%) computed deterministically against the student's profile.
- Side-by-side **Scholarship Comparison Matrix** (evaluating benefits, income caps, and document prerequisites).

### 3. Explainable Eligibility Matching Engine & What-If Simulator
- Structured 4-tier match states:
  - `Eligible` (100% Rules Met)
  - `Potentially Eligible` (Requires Institutional Bonafide/Verification)
  - `Not Eligible` (Specific disqualifying criteria identified)
  - `Insufficient Information` (Missing profile attributes)
- **Interactive Eligibility Simulator**: Sliders to test hypothetical adjustments ("What if my family income is ₹1.8L instead of ₹2.5L?", "What if my marks improve to 85%?") with live recalculation.

### 4. AI Financial Aid Copilot (with RAG & Citations)
- Grounded conversational assistant answering nuanced queries with official citations (e.g. *Telangana Social Welfare G.O. Ms. No. 66*).
- Full multi-language response capability in English, Telugu, and Hindi.
- Context injection: optionally includes the student's verified profile credentials to provide personalized answers.

### 5. Smart Document Intelligence & Cross-Document Consistency Checker
- Secure Document Vault with metadata extraction and simulated OCR confidence scores.
- **Cross-Document Consistency Matrix**: Compares Candidate Full Name, Annual Income, Parent Name, and Bank Account Holder across revenue certificates and flags discrepancies before government submission.

### 6. Zero-Repeat-Visit Assistant (Primary Differentiator)
- Step-by-step visit readiness packages for administrative procedures (*Telangana ePASS College Verification* and *Bank NPCI-DBT Aadhaar Seeding*).
- Details required original documents, number of photocopy sets (e.g. 2 sets), mandatory attestations (Principal's blue ink signature and round seal), counter locations, visiting hours, and official helplines.
- Real-time readiness status: `READY (100% Prepared)` or `ACTION REQUIRED`.
- One-click **Print Official Checklist** button.

### 7. Application Journey Navigator & Rejection Recovery
- 12-Stage Visual Stepper and Kanban tracking:
  `Discovered` → `Shortlisted` → `Eligibility Checked` → `Documents Prepared` → `Ready to Apply` → `Submitted` → `Under Verification` → `Correction Requested` → `Approved` → `Payment Pending` → `Disbursed` → `Renewal Due`.
- **Application Problem Solver**: Decodes obscure error notices (e.g. *"Income Certificate Barcode Unreadable on MeeSeva portal"* or *"Bank Account Not Seeded with NPCI"*) into root cause explanations, action plans, and direct links to the official grievance portal.

### 8. Smart Deadline Planner & Backward Scheduler
- Backward planning engine calculating milestone schedules:
  - **T-15 Days**: Apply for updated MeeSeva Income & Caste certificates.
  - **T-10 Days**: Collect College Bonafide and fee structure from Principal's office.
  - **T-6 Days**: Verify NPCI Aadhaar bank mapping.
  - **T-3 Days**: Complete online application draft and print preview.
  - **T-1 Day**: Deposit physical file with 2 self-attested photocopy sets at college desk.

### 9. Education Funding Gap Calculator
- Budget inputs: Tuition, Hostel/Living, Transportation, Books/Supplies, and Family Contribution.
- Computes Net Funding Gap and provides a **Multi-Tier Aid Stacking Strategy**:
  - *Tier 1*: Government Tuition Fee Reimbursement (RTF)
  - *Tier 2*: Government Maintenance Allowance (MTF)
  - *Tier 3*: Corporate CSR Merit Grant (Reliance / HDFC / Tata)
  - *Tier 4*: Low-Interest Education Loan (Vidya Lakshmi) — **with prominent repayment warnings so students never mistake debt for free aid!**

### 10. Scholarship Change Detector
- Monitors government orders, portal circulars, and income limit updates over time.
- Side-by-side visual diff (Previous Rule vs Updated Rule) with personalized **"Impact on Your Profile"** alerts.

### 11. Accessibility, Low-Bandwidth Mode & Scam Protection
- Mobile-first responsive layout with high-contrast slate/navy palette.
- Low-Bandwidth toggle disabling heavy media for 2G/3G connections.
- Anti-Fraud Advisory modal warning students that official scholarships are 100% free and government officers never request OTPs or fees.

---

## 🎯 Hackathon Demonstration Scenarios

Use the **Hackathon Demo Switcher** at the top of the app to toggle between pre-configured real-world scenarios:

### Scenario 1: Telangana Lateral Entry B.Tech Student (Rahul Korra)
1. Select **Rahul Korra** in the top demo switcher.
2. View **Student Financial Identity**: Diploma in ECE from Govt Polytechnic Masab Tank (84.5%), entering B.Tech 2nd year at JNTUH College of Engineering Hyderabad under Lateral Entry convenor quota. Family income ₹1,75,000/yr (BC-B).
3. Open **Scholarship Discovery**: Top match is **Telangana ePASS Post-Matric RTF & MTF** with a 100% Match score.
4. Open **Eligibility Analysis**: See transparent pass marks on all criteria. Test the **Eligibility Simulator** by sliding income to ₹2.6L → shows status change to "Not Eligible (Exceeds ₹2.0L ceiling)". Revert to ₹1.75L.
5. Open **Document Vault**: 4 documents are verified (Income, Caste, Marks Memo, Bank Passbook). A red alert flags that the **College Bonafide Certificate** is missing.
6. Open **Zero-Repeat-Visit Assistant**: Status shows `ACTION REQUIRED (57% Ready)` with instructions that the College Bonafide requires the Principal's round blue seal. Upload the Bonafide → status advances to `READY (100%)`.
7. Open **AI Copilot**: Ask in Telugu: *"లాటరల్ ఎంట్రీ విద్యార్థులకు ePASS వర్తిస్తుందా?"* → Copilot provides grounded explanation quoting Telangana G.O. Ms. No. 66.

### Scenario 2: Rejection Recovery Case (Sneha Patel)
1. Select **Sneha Patel** in the top demo switcher.
2. View **Application Journey**: Status shows `Correction Requested / Rejected`.
3. Open **Rejection Recovery**: Error text *"Income Certificate Barcode Unreadable on MeeSeva portal & Bank Account not seeded with NPCI"*.
4. AI diagnoses root cause:
   - MeeSeva certificate is > 1 year old and needs annual renewal.
   - Bank account lacks NPCI Aadhaar DBT mapping.
5. Generates step-by-step remediation plan with MeeSeva reissue steps, NPCI branch mandate form instructions, and the official ePASS Grievance Redressal link.

---

## 🚀 Running the Project

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start (Both Backend & Frontend)
Execute the unified startup script:
```bash
./start.sh
```

- **Frontend Application**: `http://localhost:5174`
- **Backend API & Swagger Docs**: `http://localhost:8002/docs`

### Manual Start

**Backend**:
```bash
cd backend
source .venv/bin/activate
python run.py
```

**Frontend**:
```bash
cd frontend
npm run dev
```

### Running Backend Tests
```bash
PYTHONPATH=backend ./backend/.venv/bin/pytest backend/tests/test_backend.py -v
```
All 9 automated test suites pass, verifying authentication, deterministic eligibility rules, simulator, consistency audits, zero-visit reports, copilot RAG, and funding gap calculations.

---

## 📄 License
MIT License. Built for educational empowerment and hackathon excellence.
