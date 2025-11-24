import React, { useState, useEffect } from 'react';
import { INITIAL_STUDENT_DATA } from './constants';
import { StudentData, IdTemplate } from './types';
import { IDCard } from './components/IDCard';
import { GeneratorForm } from './components/GeneratorForm';
import { downloadIdCard } from './utils/download';
import { GraduationCap, Layout, Sparkles, CreditCard, Share2, Check, Info, X, Copy, ExternalLink } from 'lucide-react';

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
  
  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
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
    // We optionally share track if specifically set
    if (studentData.track) url.searchParams.set('track', studentData.track);

    setGeneratedLink(url.toString());
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const templates: { id: IdTemplate; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'classic', label: 'Classic', icon: <CreditCard className="w-4 h-4" />, color: 'bg-white border-slate-200' },
    { id: 'modern', label: 'Modern', icon: <Sparkles className="w-4 h-4" />, color: 'bg-slate-900 border-slate-800 text-white' },
    { id: 'bold', label: 'Bold', icon: <Layout className="w-4 h-4" />, color: 'bg-blue-600 border-blue-600 text-white' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
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
                title="Generate a link with current settings to share with students"
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share Template</span>
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
                            <strong>Tip for Admins:</strong> Select the correct School and Cohort above, then click "Share Template" to generate a pre-filled link for your students.
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold text-slate-900">Share Template Link</h3>
                    <button 
                        onClick={() => setShowShareModal(false)} 
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                    Share this link with your students. It automatically pre-fills the 
                    <span className="font-semibold text-slate-800"> {studentData.school}</span> details, 
                    <span className="font-semibold text-slate-800"> {studentData.cohort}</span> cohort, and expiry date.
                </p>
                
                <div className="relative mb-6">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 pr-1 focus-within:ring-2 focus-within:ring-alt-blue focus-within:border-transparent transition-all">
                        <div className="pl-3 py-2 flex-1 overflow-hidden">
                             <input 
                                type="text" 
                                readOnly 
                                value={generatedLink} 
                                className="w-full bg-transparent border-none text-slate-600 text-sm focus:ring-0 truncate font-mono"
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                        <button 
                            onClick={copyToClipboard} 
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm ${
                                isCopied 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                            }`}
                        >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
                    <button 
                        onClick={() => setShowShareModal(false)} 
                        className="px-4 py-2.5 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <a 
                        href={generatedLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-5 py-2.5 bg-alt-blue text-white font-medium text-sm rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                        Test Link <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;