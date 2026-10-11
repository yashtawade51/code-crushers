import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  ArrowUpRight,
  Send,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Opportunity, ApplicationTrackerItem, ApplicationStatus } from '../types';

interface SavedTrackerViewProps {
  opportunities: Opportunity[];
  trackerItems: Record<string, ApplicationTrackerItem>;
  onUpdateStatus: (oppId: string, status: ApplicationStatus) => void;
  onUpdateNotes: (oppId: string, notes: string) => void;
  onRemoveFromTracker: (oppId: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onNavigateToExplore: () => void;
}

const STATUS_STAGES: ApplicationStatus[] = ['Saved', 'Applied', 'Interview', 'Offered', 'Rejected'];

export const SavedTrackerView: React.FC<SavedTrackerViewProps> = ({
  opportunities,
  trackerItems,
  onUpdateStatus,
  onUpdateNotes,
  onRemoveFromTracker,
  onViewDetails,
  onNavigateToExplore,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const oppsMap = new Map<string, Opportunity>();
  opportunities.forEach((o) => oppsMap.set(o.id, o));

  const trackedList = Object.values(trackerItems)
    .map((item) => ({
      item,
      opportunity: oppsMap.get(item.opportunityId),
    }))
    .filter((entry): entry is { item: ApplicationTrackerItem; opportunity: Opportunity } => !!entry.opportunity);

  const filteredList = trackedList.filter((entry) => {
    if (selectedStatusTab === 'All') return true;
    return entry.item.status === selectedStatusTab;
  });

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'Saved':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interview':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Offered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const handleStartEditNotes = (id: string, currentNotes: string) => {
    setEditingNotesId(id);
    setTempNotes(currentNotes);
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Career Management
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {trackedList.length} Active Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Application Status Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage bookmarked opportunities, track submission milestones, and log interview schedules.
            </p>
          </div>

          <button
            onClick={onNavigateToExplore}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Explore More Roles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Filter Tabs (Segmented Control) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedStatusTab('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedStatusTab === 'All'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({trackedList.length})
            </button>
            {STATUS_STAGES.map((st) => {
              const count = trackedList.filter((e) => e.item.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatusTab(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedStatusTab === st
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Opportunity List / Cards */}
        {filteredList.length > 0 ? (
          <div className="space-y-4">
            {filteredList.map(({ item, opportunity }) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${opportunity.logoBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                    >
                      {opportunity.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-semibold text-slate-800">{opportunity.company}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-teal-700 font-medium">{opportunity.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{opportunity.location}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {opportunity.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => onViewDetails(opportunity)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveFromTracker(opportunity.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Progress Stepper */}
                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Application Lifecycle Stage:
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {STATUS_STAGES.map((stage) => {
                      const isActive = item.status === stage;
                      return (
                        <button
                          key={stage}
                          onClick={() => onUpdateStatus(opportunity.id, stage)}
                          className={`py-2 px-1 text-center rounded-lg text-[11px] font-semibold border transition-all ${
                            isActive
                              ? `${getStatusBadgeStyle(stage)} font-bold shadow-xs ring-1 ring-slate-400/20`
                              : 'bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dates & Compensation meta bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <span>
                      Stipend: <strong className="text-slate-800 font-mono">{opportunity.stipendSalary}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: <strong className="text-slate-800 font-mono">{opportunity.deadline}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Tracked on {item.savedDate}
                  </span>
                </div>

                {/* Candidate Notes Section */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-slate-400" />
                      <span>Candidate Notes & Follow-ups</span>
                    </span>
                    {editingNotesId !== opportunity.id ? (
                      <button
                        onClick={() => handleStartEditNotes(opportunity.id, item.notes || '')}
                        className="text-[11px] font-semibold text-teal-700 hover:underline"
                      >
                        Edit Note
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveNotes(opportunity.id)}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        Save Note
                      </button>
                    )}
                  </div>

                  {editingNotesId === opportunity.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Write reminders, interview rounds, recruiter contact, or resume tweaks..."
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(opportunity.id)}
                          className="px-3 py-1 text-[11px] bg-slate-900 text-white rounded-md font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 italic">
                      {item.notes ? `"${item.notes}"` : 'No notes added yet. Click edit to log dates or interview rounds.'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Tracker State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No opportunities tracked in this category
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bookmark positions in the Opportunity Explorer or apply directly to automatically add them to your application pipeline.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToExplore}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
              >
                Browse Opportunities
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
