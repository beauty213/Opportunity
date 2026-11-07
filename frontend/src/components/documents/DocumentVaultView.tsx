import React, { useState, useEffect } from 'react';
import { DocumentItem } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, Upload, ShieldCheck, CheckCircle2, AlertTriangle, 
  Eye, RefreshCw, Sparkles, ArrowRight, Calendar, Lock
} from 'lucide-react';

interface VaultProps {
  onNavigate: (tab: string) => void;
}

export const DocumentVaultView: React.FC<VaultProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('bonafide_cert');
  const [selectedDocName, setSelectedDocName] = useState('JNTUH_College_Bonafide_Certificate_2026.pdf');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments(currentUser?.id || 1);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [currentUser]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const form = new FormData();
      form.append('document_type', selectedDocType);
      form.append('document_name', selectedDocName);
      form.append('notes', 'Uploaded via Student Document Vault dropzone.');

      await api.uploadDocument(form, currentUser?.id || 1);
      await fetchDocs();
      alert(`Document ${selectedDocName} uploaded and OCR parsed successfully!`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const hasBonafide = documents.some(d => d.document_type === 'bonafide_cert');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Smart Document Intelligence Vault</h2>
            <span className="text-xs bg-brand-100 text-brand-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" /> Encrypted Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Secure storage, OCR field extraction, expiry tracking, and cross-document consistency verification.
          </p>
        </div>

        <button
          onClick={() => onNavigate('zeroVisit')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto shadow-xs"
        >
          <span>Run Zero-Repeat-Visit Audit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Missing Document Warning Banner */}
      {!hasBonafide && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-200 text-rose-900 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-sm sm:text-base">
                Critical Missing Document: College Bonafide Certificate
              </h4>
              <p className="text-xs sm:text-sm text-rose-900 mt-0.5">
                Your shortlisted scholarship <strong>Telangana ePASS Post-Matric</strong> strictly requires a current academic year Bonafide signed by the Principal with college seal.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedDocType('bonafide_cert');
              setSelectedDocName('JNTUH_College_Bonafide_Certificate_2026.pdf');
            }}
            className="whitespace-nowrap px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-xs"
          >
            Upload Bonafide Now
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-600" />
          Upload & Auto-Extract Document Metadata (OCR)
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Document Category:</label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="bonafide_cert">College Bonafide / Study Certificate</option>
              <option value="income_cert">MeeSeva Income Certificate</option>
              <option value="caste_cert">MeeSeva Caste Certificate</option>
              <option value="marks_memo">Qualifying Exam Marks Memo</option>
              <option value="bank_passbook">Bank Passbook (NPCI Mapped)</option>
              <option value="fee_receipt">College Fee Receipt</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">File Name / Label:</label>
            <input
              type="text"
              value={selectedDocName}
              onChange={(e) => setSelectedDocName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Bonafide_Certificate.pdf"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Upload & Run OCR Analysis</span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Your Active Vault Records ({documents.length})</h3>
          <span className="text-xs text-slate-500">Stored with client confirmation before use</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-brand-50 text-brand-700 rounded-lg shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{doc.document_name}</h4>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">
                          {doc.document_type.replace('_', ' ')} • {doc.file_format}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      OCR: {Math.round(doc.ocr_confidence_score * 100)}%
                    </span>
                  </div>

                  {/* Extracted Metadata Pills */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5 font-mono">
                    <span className="font-sans font-bold text-[10px] uppercase text-slate-400 block tracking-wider">
                      OCR Extracted Fields
                    </span>
                    {Object.entries(doc.extracted_metadata).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-slate-700">
                        <span className="text-slate-500 capitalize">{k.replace('_', ' ')}:</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[200px]">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Metadata</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metadata Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">{previewDoc.document_name}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-500 block uppercase">Complete Extracted Fields</span>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto text-xs">
                {JSON.stringify(previewDoc.extracted_metadata, null, 2)}
              </pre>
            </div>

            <p className="text-xs text-slate-500 italic">
              Note: Extracted data must be confirmed by the student before submission. OCR does not replace physical authority seals.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
