import {
  User, StudentIdentity, Scholarship, EligibilityAssessment, SimulatorResponse,
  CopilotResponse, DocumentItem, CrossDocumentConsistencyReport, ZeroVisitReport,
  Application, ProblemSolverResponse, BackwardPlanResponse, FundingGapResponse,
  GuidelineChangeItem
} from '../types';

const API_BASE = '/api';

export const api = {
  // --- Auth & Identity ---
  async getDemoUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    if (!res.ok) throw new Error('Failed to load demo users');
    return res.json();
  },

  async getStudentIdentity(userId: number = 1): Promise<StudentIdentity> {
    const res = await fetch(`${API_BASE}/student/identity?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to load student identity');
    return res.json();
  },

  async updateProfile(userId: number, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/student/profile?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // --- Scholarships ---
  async getScholarships(params: Record<string, any> = {}): Promise<Scholarship[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const res = await fetch(`${API_BASE}/scholarships?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch scholarships');
    return res.json();
  },

  async getScholarship(id: number, userId: number = 1): Promise<Scholarship> {
    const res = await fetch(`${API_BASE}/scholarships/${id}?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch scholarship details');
    return res.json();
  },

  async compareScholarships(ids: number[], userId: number = 1): Promise<Scholarship[]> {
    const res = await fetch(`${API_BASE}/scholarships/compare/items?ids=${ids.join(',')}&user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to compare scholarships');
    return res.json();
  },

  // --- Eligibility & Simulator ---
  async assessEligibility(scholarshipId: number, userId: number = 1): Promise<EligibilityAssessment> {
    const res = await fetch(`${API_BASE}/eligibility/assess/${scholarshipId}?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to assess eligibility');
    return res.json();
  },

  async simulateEligibility(data: any, userId: number = 1): Promise<SimulatorResponse> {
    const res = await fetch(`${API_BASE}/eligibility/simulate?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },

  // --- Copilot ---
  async queryCopilot(query: string, language: string = 'en', userId: number = 1, activeScholarshipId?: number): Promise<CopilotResponse> {
    const res = await fetch(`${API_BASE}/copilot/query?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        language,
        include_student_context: true,
        active_scholarship_id: activeScholarshipId
      })
    });
    if (!res.ok) throw new Error('Failed to get copilot answer');
    return res.json();
  },

  // --- Document Intelligence ---
  async getDocuments(userId: number = 1): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/documents?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to load documents');
    return res.json();
  },

  async uploadDocument(formData: FormData, userId: number = 1): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/upload?user_id=${userId}`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  async getConsistencyAudit(userId: number = 1): Promise<CrossDocumentConsistencyReport> {
    const res = await fetch(`${API_BASE}/documents/consistency-audit?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to audit document consistency');
    return res.json();
  },

  // --- Zero-Repeat-Visit Assistant ---
  async getZeroVisitReport(processType: string = 'epass_college_verification', userId: number = 1): Promise<ZeroVisitReport> {
    const res = await fetch(`${API_BASE}/zero-visit/report?process_type=${processType}&user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to generate zero visit report');
    return res.json();
  },

  // --- Applications Journey & Problem Solver ---
  async getApplications(userId: number = 1): Promise<Application[]> {
    const res = await fetch(`${API_BASE}/applications?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to load applications');
    return res.json();
  },

  async createApplication(scholarshipId: number, userId: number = 1): Promise<any> {
    const res = await fetch(`${API_BASE}/applications/create?scholarship_id=${scholarshipId}&user_id=${userId}`, {
      method: 'POST'
    });
    return res.json();
  },

  async updateApplicationStage(applicationId: number, newStage: string, note?: string): Promise<any> {
    const query = new URLSearchParams({ new_stage: newStage });
    if (note) query.append('note', note);
    const res = await fetch(`${API_BASE}/applications/${applicationId}/stage?${query.toString()}`, {
      method: 'PUT'
    });
    return res.json();
  },

  async solveProblem(errorMessage: string, portalName: string = 'Telangana ePASS'): Promise<ProblemSolverResponse> {
    const res = await fetch(`${API_BASE}/applications/problem-solver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error_message: errorMessage, portal_name: portalName })
    });
    if (!res.ok) throw new Error('Failed to diagnose problem');
    return res.json();
  },

  // --- Planner & Funding Gap ---
  async getBackwardSchedule(title: string, deadline: string): Promise<BackwardPlanResponse> {
    const res = await fetch(`${API_BASE}/planner/backward-schedule?scholarship_title=${encodeURIComponent(title)}&deadline=${encodeURIComponent(deadline)}`);
    if (!res.ok) throw new Error('Failed to fetch backward schedule');
    return res.json();
  },

  async computeFundingGap(data: any): Promise<FundingGapResponse> {
    const res = await fetch(`${API_BASE}/planner/funding-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to calculate funding gap');
    return res.json();
  },

  // --- Change Detector ---
  async getGuidelineChanges(userId: number = 1): Promise<GuidelineChangeItem[]> {
    const res = await fetch(`${API_BASE}/changes?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch guideline changes');
    return res.json();
  },

  // --- Admin ---
  async getAdminMetrics(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    if (!res.ok) throw new Error('Failed to fetch admin metrics');
    return res.json();
  }
};
