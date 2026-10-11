import React from 'react';
import { Compass, Heart, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Rozgar<span className="text-teal-600">Link</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              AI-powered skills-to-opportunity matching engine bridging academic qualifications with real-world industry tracks.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Platform
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Opportunity Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('skillgap')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Skill-Gap Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Student Tools */}
          <div>
            <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Student Tools
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Application Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Candidate Profile & Resume
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-teal-700 transition-colors"
                >
                  Internship Search
                </button>
              </li>
            </ul>
          </div>

          {/* Engine & Evaluation Note */}
          <div>
            <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Demonstration Engine
            </p>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              RozgarLink runs an algorithmic compatibility engine evaluated client-side. Profile data and tracked applications are stored in your browser's LocalStorage.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} RozgarLink. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for student career empowerment and skill discovery</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
