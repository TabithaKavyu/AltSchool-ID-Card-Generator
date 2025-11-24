import React from 'react';
import { StudentData, IdTemplate } from '../types';
import { QrCode, ShieldCheck, Zap, Globe } from 'lucide-react';

interface IDCardProps {
  data: StudentData;
  id?: string;
  template?: IdTemplate;
}

export const IDCard: React.FC<IDCardProps> = ({ data, id, template = 'classic' }) => {
  const displayImage = data.profileImage || `https://picsum.photos/300/300`;

  const renderClassic = () => (
    <div 
      id={id}
      className="relative w-[320px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans select-none print:shadow-none transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-alt-dark overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-alt-blue rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute top-10 -left-10 w-32 h-32 bg-alt-accent rounded-full opacity-20 blur-xl"></div>
        <div className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
      </div>

      {/* Header Content */}
      <div className="relative z-10 pt-6 px-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-alt-blue font-bold text-xl">A</span>
          </div>
          <h1 className="text-white font-bold text-lg tracking-wide uppercase">AltSchool</h1>
        </div>
      </div>

      {/* Profile Image Area */}
      <div className="relative z-20 flex justify-center -mt-2">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
            <img 
              src={displayImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="flex-1 flex flex-col items-center pt-4 px-6 text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-800 leading-tight">
          {data.fullName || "Student Name"}
        </h2>
        
        <p className="text-sm font-medium text-alt-blue bg-blue-50 px-3 py-1 rounded-full">
          {data.track || "Track Name"}
        </p>

        <div className="w-full h-px bg-slate-100 my-4"></div>

        <div className="grid grid-cols-2 gap-4 w-full text-left mt-2">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Student ID</p>
            <p className="text-sm font-bold text-slate-700 font-mono">{data.studentId || "ALT-0000"}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cohort</p>
             <p className="text-sm font-bold text-slate-700">{data.cohort || "2024"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">School</p>
            <p className="text-sm font-semibold text-slate-700 truncate">
              {data.school}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / QR */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
           <p className="text-[9px] text-slate-400 font-semibold uppercase">Expires</p>
           <p className="text-xs font-bold text-slate-600">{data.expiryDate}</p>
        </div>
        
        <div className="flex items-center justify-center">
           <QrCode className="w-10 h-10 text-slate-800 opacity-80" />
        </div>
      </div>
      <div className="h-2 w-full bg-gradient-to-r from-alt-dark via-alt-blue to-alt-accent"></div>
    </div>
  );

  const renderModern = () => (
    <div 
      id={id}
      className="relative w-[320px] h-[500px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans select-none print:shadow-none text-white border border-slate-700 transition-all duration-300"
    >
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-20">
         <div className="absolute -top-20 -right-20 w-64 h-64 bg-alt-blue rounded-full blur-3xl mix-blend-overlay"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
         {/* Circuit Pattern */}
         <div className="absolute inset-0" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }}>
         </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-start">
         <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-alt-accent" />
            <span className="text-sm font-bold tracking-widest uppercase text-alt-accent">AltSchool</span>
         </div>
         <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono border border-white/20 backdrop-blur-sm">
            {data.cohort || "2024"}
         </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6">
        <div className="mt-2 mb-6 relative">
           <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-700 relative group">
               <div className="absolute inset-0 bg-alt-blue/20 group-hover:bg-transparent transition-colors z-10"></div>
               <img 
                 src={displayImage} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
                 crossOrigin="anonymous"
               />
           </div>
           {/* Floating Badge */}
           <div className="absolute -bottom-4 right-4 bg-alt-blue text-white p-2 rounded-lg shadow-lg shadow-blue-500/50">
              <Zap className="w-5 h-5 fill-current" />
           </div>
        </div>

        <div className="space-y-1">
           <h2 className="text-2xl font-bold tracking-tight truncate">{data.fullName || "Student Name"}</h2>
           <p className="text-alt-accent font-medium text-sm truncate">{data.track || "Track"}</p>
        </div>

        <div className="mt-auto mb-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
           <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">ID Number</p>
              <p className="font-mono text-sm tracking-wide text-slate-200">{data.studentId || "ALT-0000"}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">School</p>
              <p className="text-xs text-slate-200 leading-tight">{data.school}</p>
           </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-1.5 w-full flex">
         <div className="h-full w-1/3 bg-alt-accent"></div>
         <div className="h-full w-1/3 bg-alt-blue"></div>
         <div className="h-full w-1/3 bg-white"></div>
      </div>
    </div>
  );

  const renderBold = () => (
    <div 
      id={id}
      className="relative w-[320px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans select-none print:shadow-none transition-all duration-300"
    >
      {/* Top Graphic */}
      <div className="h-32 bg-alt-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-alt-accent opacity-50 transform translate-x-10 -translate-y-10 rotate-45"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 transform -translate-x-10 translate-y-10 rotate-45"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-black tracking-tighter italic opacity-20 scale-150">ALTSCHOOL</h1>
        </div>
      </div>

      {/* Floating Image */}
      <div className="flex flex-col items-center -mt-16 relative z-10 px-6">
        <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg bg-white overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-300">
           <img 
              src={displayImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
           />
        </div>
        
        <div className="mt-4 text-center w-full">
           <h2 className="text-2xl font-black text-slate-900 uppercase leading-none mb-2">
             {data.fullName || "Student Name"}
           </h2>
           <span className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
             {data.school?.replace('School of ', '') || "School"}
           </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="flex-1 px-8 py-6 space-y-4">
         <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Track</p>
               <p className="text-sm font-bold text-alt-blue">{data.track || "Track Name"}</p>
            </div>
         </div>

         <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">ID No.</p>
               <p className="text-sm font-bold text-slate-800 font-mono">{data.studentId || "ALT-0000"}</p>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-slate-400 uppercase">Valid Thru</p>
               <p className="text-sm font-bold text-slate-800">{data.expiryDate}</p>
            </div>
         </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
         <div className="text-[10px] leading-tight opacity-70">
            <p>AltSchool Africa</p>
            <p>Student Identity Card</p>
         </div>
         <QrCode className="w-8 h-8 bg-white text-slate-900 p-1 rounded" />
      </div>
    </div>
  );

  switch (template) {
    case 'modern':
      return renderModern();
    case 'bold':
      return renderBold();
    case 'classic':
    default:
      return renderClassic();
  }
};