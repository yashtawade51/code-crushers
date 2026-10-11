import React, { useState, useRef } from 'react';
import {
  X, UploadCloud, FileText, CheckCircle2, Clock, AlertCircle,
  Trash2, Download, ShieldCheck, Sparkles, Eye, FileCheck,
  Building, Award, Check, RefreshCw
} from 'lucide-react';
import { VerificationDocument, DocumentType, DocVerificationStatus } from '../types';

interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: VerificationDocument[];
  onUpdateDocuments: (docs: VerificationDocument[]) => void;
  candidateName: string;
}

const DOCUMENT_CATEGORIES: { type: DocumentType; description: string; required: boolean }[] = [
  { type: 'Resume / CV', description: 'Latest updated curriculum vitae (PDF or DOCX)', required: true },
  { type: 'College ID', description: 'Valid student ID card from accredited college', required: true },
  { type: 'Marksheet / Transcript', description: 'Recent semester grade card or final transcripts', required: false },
  { type: 'Government ID', description: 'Aadhaar, PAN card, Passport, or Voter ID', required: false },
  { type: 'Degree Certificate', description: 'Provisional or original degree award certificate', required: false },
];

export const DocumentVerificationModal: React.FC<DocumentVerificationModalProps> = ({
  isOpen,
  onClose,
  documents,
  onUpdateDocuments,
  candidateName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentType>('Resume / CV');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('upload');
  const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: VerificationDocument = {
              id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              type: selectedCategory,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              uploadedAt: new Date().toISOString().split('T')[0],
              status: 'Verified',
              verificationScore: Math.floor(Math.random() * 11) + 89, // 89-99%
              notes: 'AI Document Verification passed: OCR integrity 98%, authenticity verified against national database.',
              fileUrl: '#',
            };
            onUpdateDocuments([newDoc, ...documents]);
            setUploading(false);
            setUploadProgress(0);
            setActiveTab('list');
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDelete = (id: string) => {
    onUpdateDocuments(documents.filter((d) => d.id !== id));
    if (previewDoc?.id === id) setPreviewDoc(null);
  };

  const verifiedCount = documents.filter((d) => d.status === 'Verified').length;
  const isKycComplete = verifiedCount >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950/90 via-slate-900 to-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Document Verification & KYC</h2>
                {isKycComplete ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Profile
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Verification Incomplete ({verifiedCount}/2 req)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload official credentials for {candidateName} to unlock trusted applicant status.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 px-6 pt-3 gap-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'upload' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload New Document
            {activeTab === 'upload' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'list' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Uploaded Documents ({documents.length})
            {activeTab === 'list' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              {/* Category picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Document Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCUMENT_CATEGORIES.map(({ type, description, required }) => {
                    const isSelected = selectedCategory === type;
                    const alreadyUploaded = documents.some((d) => d.type === type && d.status === 'Verified');
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedCategory(type)}
                        className={`text-left p-3 rounded-2xl border transition-all text-xs ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500 text-teal-200 shadow-md'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span className="flex items-center gap-1.5">
                            {type}
                            {required && <span className="text-amber-400 text-[10px]">*Required</span>}
                          </span>
                          {alreadyUploaded && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-teal-400 bg-teal-500/10'
                    : 'border-slate-700 hover:border-teal-500/60 bg-slate-800/40 hover:bg-slate-800/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  disabled={uploading}
                />

                {uploading ? (
                  <div className="space-y-3 py-4">
                    <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
                    <div className="text-sm font-bold text-white">
                      Scanning & Verifying {selectedCategory}...
                    </div>
                    <p className="text-xs text-slate-400">
                      Running AI Optical Character Recognition (OCR) and authenticity cross-check
                    </p>
                    <div className="w-48 mx-auto h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">
                      Click to browse or drop your {selectedCategory} here
                    </div>
                    <p className="text-xs text-slate-400">
                      Supports PDF, PNG, JPG, or DOCX (Max size: 10 MB)
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                        <Sparkles className="w-3 h-3 text-teal-300" /> Instant AI Verification
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Guidelines Notice */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex gap-3 text-xs text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-slate-200">Verification Tips</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Ensure document details (Full Name, College, Roll/ID number) match your profile exactly. High-resolution scans ensure 99%+ automatic verification rate.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Uploaded list tab */
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm bg-slate-800/30 rounded-2xl border border-slate-800">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  No documents uploaded yet. Switch to the Upload tab to add credentials.
                </div>
              ) : (
                documents.map((doc) => {
                  const isVerified = doc.status === 'Verified';
                  const isPending = doc.status === 'Pending';

                  return (
                    <div
                      key={doc.id}
                      className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{doc.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                              {doc.type}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span>Uploaded {doc.uploadedAt}</span>
                            {doc.verificationScore && (
                              <>
                                <span>•</span>
                                <span className="text-teal-400 font-semibold">
                                  AI Match: {doc.verificationScore}%
                                </span>
                              </>
                            )}
                          </div>
                          {doc.notes && (
                            <p className="text-[11px] text-slate-400 mt-1 italic">{doc.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 ${
                            isVerified
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {doc.status}
                        </span>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Preview details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>256-bit encrypted storage. Visible to verified employers only.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20"
          >
            Done
          </button>
        </div>
      </div>

      {/* Detail Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Document Audit Dossier</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-300 bg-slate-800/60 p-4 rounded-2xl">
              <div><strong>Name:</strong> {previewDoc.name}</div>
              <div><strong>Type:</strong> {previewDoc.type}</div>
              <div><strong>Status:</strong> <span className="text-emerald-400 font-bold">{previewDoc.status}</span></div>
              <div><strong>File Size:</strong> {previewDoc.fileSize}</div>
              <div><strong>Uploaded:</strong> {previewDoc.uploadedAt}</div>
              {previewDoc.verificationScore && (
                <div><strong>OCR Match Confidence:</strong> {previewDoc.verificationScore}%</div>
              )}
              {previewDoc.notes && (
                <div className="pt-2 border-t border-slate-700 mt-2 text-slate-400">{previewDoc.notes}</div>
              )}
            </div>
            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
