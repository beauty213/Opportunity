# ScholarEase: F.A.I.R.E. Engineering Architecture

> **Engineering Design Specification for Hackathon Evaluation**  
> *Architected for High-Impact Educational Mobility & Scalable Public Digital Infrastructure*

---

## 1. Executive Engineering Summary

ScholarEase addresses the structural hurdles that prevent eligible Indian students from claiming over ₹2,500 Crores in unclaimed scholarships and fee reimbursements annually. Rather than acting as a superficial directory or generic chatbot, ScholarEase is built on a **Deterministic Rule Engine** coupled with a **Grounded RAG Copilot** and an **Automated Document Intelligence Pipeline**.

The system strictly adheres to the **F.A.I.R.E. Engineering Principles**:
- **F** – **Findable**: Uniform scholarship schemas, deep indexing, and verifiable identity tokens (`SE-ID-XXXXX`).
- **A** – **Accessible**: Trilingual localization (English, Telugu, Hindi), Low-Bandwidth Mode for 2G/3G networks, and printable offline dossiers.
- **I** – **Interoperable**: Standard OpenAPI 3.0 specification, Pydantic DTOs, and portable SQLite/PostgreSQL abstractions.
- **R** – **Reproducible & Reliable**: Deterministic rule matching (100% auditable, zero AI hallucinations on eligibility), comprehensive automated PyTest coverage, and single-command deployment.
- **E** – **Explainable & Ethical**: 4-tier transparent eligibility breakdowns, cross-document discrepancy auditing, anti-fraud safeguards, and zero collection of sensitive banking credentials.

---

## 2. Clean Architecture Layering

ScholarEase enforces a strict **Separation of Concerns (SoC)** following Domain-Driven Clean Architecture:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                               │
│  React 18 + TypeScript + Tailwind CSS • Trilingual Engine (EN / TE / HI)   │
│  Responsive UI • Offline Print Stylesheets • Low-Bandwidth Mode Toggle      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / JSON API
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            CONTROLLER / API LAYER                           │
│  FastAPI Routers: Auth, Student, Scholarships, Eligibility, Copilot,       │
│  Documents, Zero-Visit, Applications, Planner, Change Detector, Admin       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ DTOs (Pydantic v2)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                               SERVICE LAYER                                 │
│  • Deterministic Eligibility Engine    • RAG Guidance Synthesizer           │
│  • What-If Simulator Sandbox          • Document Consistency Auditor        │
│  • Zero-Repeat-Visit Package Builder   • Backward Milestone Scheduler       │
│  • Rejection Recovery Diagnoser        • Multi-Tier Aid Stacking Calculator │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Domain Entities
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         DATA PERSISTENCE & SCHEMAS                          │
│  SQLAlchemy 2.0 ORM • SQLite (Zero-Dependency) / PostgreSQL Dual-Engine     │
│  Pydantic v2 Request/Response Schemas • Seed Data Catalog                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The F.A.I.R.E. Matrix Implementation

### F — Findability
| Feature | Architectural Mechanism | Implementation File |
| :--- | :--- | :--- |
| **Unified Catalog** | Normalized schema with compound indexing on `target_state`, `provider_type`, and `education_levels`. | `backend/app/models/models.py` |
| **Student Financial Identity** | Cryptographically derived identity hash token (`SE-ID-XXXXX`) generated from verified student attributes. | `backend/app/api/student.py` |
| **Multi-Facet Discovery** | Multi-dimensional query filters matching candidate marks, family income, lateral entry tags, and deadlines. | `backend/app/api/scholarships.py` |

### A — Accessibility
| Feature | Architectural Mechanism | Implementation File |
| :--- | :--- | :--- |
| **Trilingual UI** | Extensible translation dictionaries for English, Telugu (తెలుగు), and Hindi (हिन्दी) supporting immediate language switching. | `frontend/src/data/translations.ts` |
| **Low-Bandwidth Mode** | CSS-level elimination of non-critical decorative assets and animations for 2G/3G connections. | `frontend/src/index.css` |
| **Zero-Repeat-Visit Physical Export** | Standardized `@media print` stylesheets enabling one-click printing of verification dossiers and checklists. | `frontend/src/components/zero_visit/ZeroRepeatVisitView.tsx` |

### I — Interoperability
| Feature | Architectural Mechanism | Implementation File |
| :--- | :--- | :--- |
| **OpenAPI 3.0 Specs** | Auto-generated Swagger/ReDoc endpoints accessible at `/docs` and `/openapi.json`. | `backend/app/main.py` |
| **Dual Database Abstraction** | SQLAlchemy connection pooling dynamically handling SQLite for local runs and PostgreSQL via `DATABASE_URL`. | `backend/app/core/database.py` |
| **Standardized DTOs** | Strongly-typed Pydantic v2 schemas providing contract-first data validation between frontend and backend. | `backend/app/schemas/schemas.py` |

### R — Reproducibility & Reliability
| Feature | Architectural Mechanism | Implementation File |
| :--- | :--- | :--- |
| **Deterministic Rules** | Mathematical rule evaluation engine evaluating `<=`, `>=`, `==`, and `IN` operators without generative hallucinations. | `backend/app/services/eligibility_service.py` |
| **Automated Testing** | 9 end-to-end PyTest suites validating authentication, eligibility rules, document audits, copilot RAG, and planners. | `backend/tests/test_backend.py` |
| **Single-Command Launch** | Executable `start.sh` orchestrating backend and frontend services with clean PID termination. | `start.sh` |

### E — Explainability & Ethics
| Feature | Architectural Mechanism | Implementation File |
| :--- | :--- | :--- |
| **4-Tier Match States** | `Eligible`, `Potentially Eligible`, `Not Eligible`, `Insufficient Info` with transparent rule-by-rule audit matrix. | `backend/app/services/eligibility_service.py` |
| **Cross-Document Consistency Audit** | Automated discrepancy detection comparing Name, Income, DOB, and Bank Beneficiary across revenue certificates. | `backend/app/services/document_service.py` |
| **Anti-Fraud Guard** | Prominent warning modal reminding students that official government aid is 100% free; direct link to Cyber Crime helpline (1930). | `frontend/src/components/layout/FraudAlertModal.tsx` |
| **Data Minimization** | Zero collection or retention of OTPs, banking passwords, or Aadhaar biometrics. | `backend/app/core/config.py` |

---

## 4. Deterministic Rule Engine vs. AI Explanation

A critical architectural tenet of ScholarEase is: **"Never let an LLM independently decide official eligibility."**

```
                       ┌─────────────────────────┐
                       │ Student Profile Inputs  │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │ Deterministic Evaluator │
                       │ (Structured Operator &  │
                       │   Threshold Evaluation) │
                       └────────────┬────────────┘
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
            [Pass / Fail Audit]       [Deficit Identification]
            Income <= Ceiling         Income Exceeds by ₹50k
            Marks >= Cutoff           Requires Bonafide Seal
                       │                         │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   AI Explanatory Layer  │
                       │ (Contextualizes results │
                       │ with official citations)│
                       └─────────────────────────┘
```

1. **Deterministic Layer (`services/eligibility_service.py`)**:
   - Compares profile parameters against statutory rules published in government gazettes (e.g. Telangana G.O. Ms. No. 66).
   - Generates exact numerical diffs (e.g. *"Income ₹2,50,000 exceeds ceiling of ₹2,00,000 by ₹50,000"*).
2. **AI Explanatory Layer (`services/copilot_service.py`)**:
   - Takes the structured rule output and translates it into empathetic, clear advice in English, Telugu, or Hindi.
   - Attaches official government citations (`[Officially Verified Source]`) with direct portal links.

---

## 5. Extensibility Protocol: Adding New Regional Schemes

ScholarEase is architected to scale from Telangana to other Indian states (e.g., Andhra Pradesh JVD, Karnataka SSP, Maharashtra MahaDBT) without modifying core engine logic:

1. **Define Scheme Metadata**: Add an entry into the `Scholarship` model specifying `target_state`, `provider_type`, `financial_benefits`, and `allows_lateral_entry`.
2. **Attach Structured Rules**: Insert corresponding `EligibilityRule` records with operator, threshold value, and category tags:
   ```json
   {
     "rule_code": "AP_JVD_INCOME",
     "rule_name": "Jagananna Vidya Deevena Income Ceiling",
     "category": "financial",
     "operator": "<=",
     "threshold_value": "250000",
     "is_mandatory": true
   }
   ```
3. **Index Statutory Guidelines**: Add relevant circulars to `KNOWLEDGE_BASE` in `copilot_service.py` to enable localized trilingual explanations.

---

## 6. Verification & Test Evidence

All automated test suites execute in sandboxed, reproducible environments:
```bash
PYTHONPATH=backend ./backend/.venv/bin/pytest backend/tests/test_backend.py -v
```
- `test_health_and_root`: Verifies API availability and health check.
- `test_demo_users_and_identity`: Verifies Student Financial Identity hash and completeness.
- `test_scholarships_listing_and_match`: Verifies dynamic match scores for Lateral Entry B.Tech.
- `test_eligibility_engine_and_simulator`: Verifies 4-tier match states and what-if simulation.
- `test_cross_document_consistency_audit`: Verifies cross-certificate attribute matching.
- `test_zero_visit_assistant`: Verifies visit checklist generation and photocopy counts.
- `test_ai_copilot_rag`: Verifies trilingual Q&A and official government citations.
- `test_application_problem_solver`: Verifies rejection notice diagnosis and grievance routing.
- `test_planner_and_funding_gap`: Verifies backward deadline milestones and aid stacking with loan alerts.
