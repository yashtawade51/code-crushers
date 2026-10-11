import React, { useState } from 'react';
import {
  Compass, Menu, X, ArrowUpRight, ShieldCheck,
  Building2, LogOut, LogIn, User
} from 'lucide-react';
import { AuthUser, UserRole } from './LoginPage';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  savedCount: number;
  authUser?: AuthUser | null;
  onOpenLogin?: (role?: UserRole) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  savedCount,
  authUser,
  onOpenLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'explore', label: 'Explore' },
    { id: 'skillgap', label: 'Skill Gap' },
    { id: 'tracker', label: savedCount > 0 ? `Tracker (${savedCount})` : 'Tracker' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-teal-900 to-teal-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-teal-300" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Rozgar<span className="text-teal-600">Link</span>
            </span>
          </button>

          {/* Zone 2: 4-5 single-line nav links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions + Auth Integration */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Verify Docs */}
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/90 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              title="Upload & Manage Verification Documents"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Verify Docs</span>
            </button>

            {/* Opportunities button */}
            {currentTab !== 'explore' ? (
              <button
                onClick={() => onNavigate('explore')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Find Jobs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Dashboard</span>
              </button>
            )}

            {/* Joined Login / Auth Section */}
            {authUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{authUser.name}</span>
                  <span className="text-[10px] text-teal-700 font-mono font-semibold">{authUser.id}</span>
                </div>
                <button
                  onClick={() => onOpenLogin?.('recruiter')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-all flex items-center gap-1"
                  title="Switch to Recruiter Workspace"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden xl:inline">Recruiter</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => onOpenLogin?.('candidate')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-600" />
                  <span>Candidate Login</span>
                </button>
                <button
                  onClick={() => onOpenLogin?.('recruiter')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Recruiter Portal</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === item.id
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {authUser ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">{authUser.name}</div>
                  <div className="text-[10px] text-teal-700 font-mono font-semibold">{authUser.id}</div>
                </div>
                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenLogin?.('candidate');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Candidate</span>
                </button>
                <button
                  onClick={() => {
                    onOpenLogin?.('recruiter');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Recruiter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
