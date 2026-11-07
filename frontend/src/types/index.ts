export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface EducationalRecord {
  id?: number;
  education_level: string;
  course_name: string;
  branch: string;
  institution_name: string;
  university_name: string;
  institution_state: string;
  academic_year: number;
  current_semester: number;
  admission_type: string;
  previous_qualification: string;
  previous_marks_percentage: number;
  current_cgpa?: number;
  hall_ticket_number: string;
}

export interface FinancialProfile {
  id?: number;
  annual_family_income: number;
  income_certificate_number: string;
  income_certificate_issue_date: string;
  annual_tuition_fee: number;
  hostel_living_expenses: number;
  transportation_expenses: number;
  family_contribution: number;
  existing_financial_aid: number;
  bank_name: string;
  bank_account_no: string;
  bank_ifsc: string;
  is_aadhaar_seeded_npci: boolean;
}

export interface StudentIdentity {
  id: number;
  user_id: number;
  full_name: string;
  dob?: string;
  gender?: string;
  state: string;
  district?: string;
  phone?: string;
  category: string;
  sub_caste?: string;
  is_disabled: boolean;
  is_first_generation: boolean;
  educational_record?: EducationalRecord;
  financial_profile?: FinancialProfile;
  verified_identity_hash: string;
  profile_completion_percentage: number;
}

export interface Scholarship {
  id: number;
  title: string;
  slug: string;
  provider: string;
  provider_type: string;
  target_state: string;
  description: string;
  financial_benefits: string;
  award_amount_max: number;
  deadline: string;
  is_active: boolean;
  is_renewal_allowed: boolean;
  is_fully_funded: boolean;
  education_levels: string;
  eligible_courses: string;
  min_percentage: number;
  max_family_income: number;
  eligible_categories: string;
  allows_lateral_entry: boolean;
  verification_status: string;
  official_source_url: string;
  apply_url: string;
  required_documents_json: string;
  application_procedure_markdown: string;
  match_score?: number;
  match_status?: 'Eligible' | 'Potentially Eligible' | 'Not Eligible' | 'Insufficient Information';
  eligibility_summary?: string;
}

export interface RuleCheckResult {
  rule_code: string;
  rule_name: string;
  category: string;
  student_value: any;
  required_condition: string;
  passed: boolean;
  explanation: string;
}

export interface EligibilityAssessment {
  scholarship_id: number;
  scholarship_title: string;
  status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible' | 'Insufficient Information';
  match_score: number;
  rule_checks: RuleCheckResult[];
  ai_explanation: string;
  next_steps: string[];
  caveat: string;
}

export interface SimulatorResponse {
  original_status: string;
  simulated_status: string;
  original_score: number;
  simulated_score: number;
  changed_factors: string[];
  impact_explanation: string;
}

export interface CitationSource {
  title: string;
  clause: string;
  url: string;
  verified: boolean;
}

export interface CopilotResponse {
  answer: string;
  language: string;
  citations: CitationSource[];
  suggested_questions: string[];
  action_pills: { label: string; route: string }[];
}

export interface DocumentItem {
  id: number;
  student_id: number;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size_kb: number;
  file_format: string;
  is_verified: boolean;
  upload_date: string;
  expiry_date?: string;
  extracted_metadata: Record<string, any>;
  ocr_confidence_score: number;
  notes?: string;
}

export interface DiscrepancyItem {
  field_name: string;
  severity: 'MATCH' | 'MINOR_DISCREPANCY' | 'CRITICAL_MISMATCH';
  source_document_1: string;
  value_1: string;
  source_document_2: string;
  value_2: string;
  explanation: string;
  remediation_guidance: string;
}

export interface CrossDocumentConsistencyReport {
  student_id: number;
  overall_status: 'ALL_VERIFIED_MATCH' | 'MINOR_ISSUES_DETECTED' | 'CRITICAL_DISCREPANCIES';
  match_percentage: number;
  discrepancies: DiscrepancyItem[];
  audit_timestamp: string;
}

export interface ZeroVisitChecklistItem {
  item_id: string;
  document_name: string;
  category: string;
  is_mandatory: boolean;
  quantity_required: number;
  uploaded_in_vault: boolean;
  vault_doc_id?: number;
  attestation_instructions: string;
  special_notes: string;
}

export interface ZeroVisitReport {
  process_name: string;
  target_office: string;
  office_address: string;
  visiting_hours: string;
  contact_helpline: string;
  readiness_status: 'READY' | 'ACTION REQUIRED' | 'REQUIREMENTS UNCLEAR';
  readiness_score: number;
  missing_mandatory_count: number;
  checklist: ZeroVisitChecklistItem[];
  official_rules_summary: string;
  critical_dos_and_donts: string[];
}

export interface ApplicationEvent {
  id: number;
  event_title: string;
  event_description?: string;
  stage: string;
  timestamp: string;
  source: string;
}

export interface Application {
  id: number;
  scholarship_id: number;
  scholarship_title: string;
  application_reference_no?: string;
  portal_name: string;
  current_stage: string;
  is_officially_verified: boolean;
  submission_date?: string;
  last_status_update_date: string;
  rejection_reason?: string;
  correction_deadline?: string;
  events: ApplicationEvent[];
  next_action_recommendation: string;
}

export interface ProblemSolverResponse {
  diagnosed_issue: string;
  severity: string;
  root_cause_explanation: string;
  official_rule_reference: string;
  remedial_steps: string[];
  grievance_portal_url?: string;
  escalation_contacts: { role: string; contact: string }[];
  can_appeal_or_correct: boolean;
  recommended_deadline_days: number;
}

export interface DeadlineMilestone {
  milestone_date: string;
  days_remaining: number;
  title: string;
  description: string;
  category: string;
  is_completed: boolean;
}

export interface BackwardPlanResponse {
  scholarship_title: string;
  final_deadline: string;
  milestones: DeadlineMilestone[];
  recommendation_summary: string;
}

export interface AidStackLayer {
  layer_name: string;
  type_tag: string;
  estimated_amount: number;
  eligibility_note: string;
  is_loan: boolean;
  repayment_warning?: string;
}

export interface FundingGapResponse {
  total_educational_expenses: number;
  existing_funding_available: number;
  net_funding_gap: number;
  aid_stack: AidStackLayer[];
  advisory_notice: string;
}

export interface GuidelineChangeItem {
  scholarship_title: string;
  version_tag: string;
  publication_date: string;
  change_category: string;
  previous_rule: string;
  updated_rule: string;
  official_document_ref: string;
  impact_on_user_profile: string;
  user_action_required: boolean;
}
