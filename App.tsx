import React, { useState, useEffect } from 'react';
import { INITIAL_STUDENT_DATA } from './constants';
import { StudentData, IdTemplate } from './types';
import { IDCard } from './components/IDCard';
import { GeneratorForm } from './components/GeneratorForm';
import { downloadIdCard } from './utils/download';
import { GraduationCap, Layout, Sparkles, CreditCard, Share2, Check, Info } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state from URL params if available, otherwise use defaults
  const [studentData, setStudentData] = useState<StudentData>(() => {
    if (typeof window === 'undefined') return INITIAL_STUDENT_DATA;
    
    const params = new URLSearchParams(window.location.search);
    const schoolParam = params.get('school');
    const trackParam = params.get('track');
    const cohortParam = params.get('cohort');
    const expiryParam = params.get('expiryDate');

    return {
      ...INITIAL_STUDENT_DATA,
      school: schoolParam || INITIAL_STUDENT_DATA.school,
      track: trackParam || INITIAL_STUDENT_DATA.track,
      cohort: cohortParam || INITIAL_STUDENT_DATA.cohort,
      expiryDate: expiryParam || INITIAL_STUDENT_DATA.expiryDate,
    };
  });

  const [template, setTemplate] = useState<IdTemplate>('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    // Slight delay to ensure UI is ready (and to show loading state for UX)
    setTimeout(async () => {
      await downloadIdCard('id-card-preview', studentData.fullName || 'AltSchool_Student');
      setIsGenerating(false);
    }, 800);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    // Clear PII/State specific params just in case, rebuild from current config
    url.search = '';
    
    // Set shared parameters (School, Cohort, Expiry) so students get pre-filled forms
    url.searchParams.set('school', studentData.school);
    if (studentData.cohort) url.searchParams.set('cohort', studentData.cohort);
    if (studentData.expiryDate) url.searchParams.set('expiryDate', studentData.expiryDate);
    // We optionally share track if specifically set, though often students pick their own
    if (studentData.track) url.searchParams.set('track', studentData.track);

    navigator.clipboard.writeText(url.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const templates: { id: IdTemplate; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'classic', label: 'Classic', icon: <CreditCard className="w-4 h-4" />, color: 'bg-white border-slate-200' },
    { id: 'modern', label: 'Modern', icon: <Sparkles className="w-4 h-4" />, color: 'bg-slate-900 border-slate-800 text-white' },
    { id: 'bold', label: 'Bold', icon: <Layout className="w-4 h-4" />, color: 'bg-blue-600 border-blue-600 text-white' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-alt-dark rounded-lg flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">AltID<span className="text-alt-blue">Gen</span></span>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
             <button 
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-sm font-medium hover:bg-alt-blue hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-alt-blue focus:ring-offset-1 group"
                title="Copy link with current School settings to share with students"
            >
                {isCopied ? <Check className="w-4 h-4 text-green-500 group-hover:text-white" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCopied ? 'Link Copied!' : 'Share Template'}</span>
            </button>

            <a 
                href="https://altschoolafrica.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-500 hover:text-alt-blue transition-colors"
            >
                AltSchool Africa
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
                    Create Your Digital Student ID
                </h1>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Generate an official-style AltSchool Africa ID card in seconds. Fill in your details, choose a template, and download.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Form */}
                <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
                    <GeneratorForm 
                        data={studentData} 
                        onChange={setStudentData}
                        onGenerate={handleDownload}
                        isGenerating={isGenerating}
                    />
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                        <Info className="w-5 h-5 text-alt-blue shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            <strong>Tip for Admins:</strong> Select the correct School and Cohort above, then click "Share Template" in the header to send a pre-filled link to your students.
                        </p>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex flex-col items-center">
                    <div className="sticky top-24 w-full flex flex-col items-center">
                        
                        {/* Template Selector */}
                        <div className="mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-200 inline-flex space-x-2 overflow-x-auto max-w-full">
                          {templates.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setTemplate(t.id)}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                template === t.id 
                                  ? 'bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200' 
                                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 border shadow-sm ${t.color}`}>
                                {t.icon}
                              </span>
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {/* Card Preview Area */}
                        <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 inline-block relative">
                             <div className={`rounded-2xl p-8 border border-slate-200 transition-colors duration-500 ${template === 'modern' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className="transform transition-transform duration-300 hover:scale-[1.02]">
                                    <IDCard 
                                      data={studentData} 
                                      id="id-card-preview" 
                                      template={template} 
                                    />
                                </div>
                             </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-400">
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Live Preview
                            </span>
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-alt-blue rounded-full mr-2"></span>
                                High Quality PNG
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} AltSchool ID Generator. Not officially affiliated with AltSchool Africa management.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;