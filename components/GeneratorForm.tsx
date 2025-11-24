import React, { useRef, useState, useEffect } from 'react';
import { SchoolOption, StudentData, SCHOOL_TRACKS } from '../types';
import { SCHOOLS } from '../constants';
import { Upload, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';

interface GeneratorFormProps {
  data: StudentData;
  onChange: (data: StudentData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ 
  data, 
  onChange, 
  onGenerate,
  isGenerating 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customTrackMode, setCustomTrackMode] = useState(false);
  const [availableTracks, setAvailableTracks] = useState<string[]>([]);

  // Update available tracks when school changes
  useEffect(() => {
    const tracks = SCHOOL_TRACKS[data.school as SchoolOption] || [];
    setAvailableTracks(tracks);
    
    // Reset track if it's not in the new list, unless custom
    if (!customTrackMode && !tracks.includes(data.track) && tracks.length > 0) {
        onChange({ ...data, track: tracks[0] });
    }
  }, [data.school]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };

    // Auto-calculate expiry if cohort changes to a 4-digit year (Assuming 12 month program)
    if (name === 'cohort') {
        if (/^\d{4}$/.test(value)) {
            const year = parseInt(value);
            // Default to Dec of the following year as standard program end
            newData.expiryDate = `Dec ${year + 1}`;
        }
    }

    onChange(newData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onChange({ ...data, profileImage: imageUrl });
    }
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange({ ...data, profileImage: null });
  };

  const toggleTrackMode = () => {
      setCustomTrackMode(!customTrackMode);
      if (!customTrackMode) {
          onChange({ ...data, track: '' });
      } else {
          const tracks = SCHOOL_TRACKS[data.school as SchoolOption] || [];
          onChange({ ...data, track: tracks[0] || '' });
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="w-1 h-6 bg-alt-blue rounded-full mr-3"></span>
          Student Details
        </h2>
        
        <div className="space-y-4">
          {/* Photo Upload */}
          <div className="w-full">
             <label className="block text-sm font-medium text-slate-600 mb-2">Profile Photo</label>
             <div className="flex items-center space-x-4">
                <div 
                  className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {data.profileImage ? (
                    <img src={data.profileImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs py-1.5 px-3 h-8"
                  >
                    Upload Photo
                  </Button>
                  {data.profileImage && (
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center font-medium"
                    >
                      <X className="w-3 h-3 mr-1" /> Remove
                    </button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
             </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={data.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Adewale Johnson"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={data.studentId}
              onChange={handleInputChange}
              placeholder="ALT/SOE/023/..."
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Cohort & Expiry */}
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Cohort Year</label>
              <input
                type="text"
                name="cohort"
                value={data.cohort}
                onChange={handleInputChange}
                placeholder="2024"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Valid Until</label>
              <input
                type="text"
                name="expiryDate"
                value={data.expiryDate}
                onChange={handleInputChange}
                placeholder="Dec 2025"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* School Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">School</label>
            <div className="relative">
              <select
                name="school"
                value={data.school}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
              >
                {SCHOOLS.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Track Selection */}
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-600">Track</label>
                <button 
                    type="button" 
                    onClick={toggleTrackMode}
                    className="text-xs text-alt-blue hover:underline"
                >
                    {customTrackMode ? "Select from list" : "Type custom track"}
                </button>
            </div>
            
            {customTrackMode ? (
                 <input
                    type="text"
                    name="track"
                    value={data.track}
                    onChange={handleInputChange}
                    placeholder="Enter your specific track"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    autoFocus
                 />
            ) : (
                <div className="relative">
                    <select
                        name="track"
                        value={data.track}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-alt-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                    >
                        {availableTracks.map(track => (
                        <option key={track} value={track}>{track}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
            )}
          </div>
        </div>
      </div>

      <Button 
        onClick={onGenerate} 
        isLoading={isGenerating}
        className="w-full h-12 text-lg"
      >
        Download ID Card
      </Button>
    </div>
  );
};