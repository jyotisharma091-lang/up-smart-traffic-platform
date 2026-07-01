import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, MapPin, CheckCircle, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { pageVariants } from '../../utils/animations';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Violation } from '../../types';

export const CaptureViolation: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Photo, 2: Details, 3: Review
  const [image, setImage] = useState<string | null>(null);
  
  // Form fields
  const [regNumber, setRegNumber] = useState('');
  const [violationType, setViolationType] = useState('');
  const [location, setLocation] = useState('');
  const [violatorMobile, setViolatorMobile] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success_sms' | 'success_queue'>('idle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleImageCapture = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setSubmitStatus('submitting');
    try {
      const payload = {
        district: user?.district || 'Lucknow',
        location: location || 'GPS auto-detected location',
        imageBase64: image,
        vehicleNumber: regNumber,
        violationType: violationType,
        violatorMobile: violatorMobile
      };

      const response = await ApiService.submitViolation(payload);
      
      // Determine the true status based on the backend response
      const violationStatus = response.data?.status;
      if (violationStatus === 'OFFICER_REVIEW') {
        setSubmitStatus('success_sms'); // Using this just for the UI feedback
        alert('Case saved to your Review Queue since no violation was detected.');
      } else if (violationStatus === 'VERIFICATION_QUEUE') {
        setSubmitStatus('success_queue');
        alert('After 3 violations, your case is transferred to district admin for action');
      } else {
        setSubmitStatus('success_sms');
        alert('Warning msg sent to person');
      }

      // Navigate immediately after the user dismisses the alert
      navigate('/officer/cases');
      
    } catch (err) {
      console.error('Failed to submit', err);
      setSubmitStatus('idle');
    }
  };

  const steps = [
    { num: 1, title: "Photo" },
    { num: 2, title: "Details" },
    { num: 3, title: "Review" }
  ];

  const handleNextStep1 = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await ApiService.analyzeImage(image);
      if (result && result.data) {
        setRegNumber(result.data.vehicleNumber || '');
        
        let aiType = result.data.suggestedType || '';
        const aiTypeLower = aiType.toLowerCase();
        if (aiTypeLower.includes('helmet')) aiType = 'no_helmet';
        else if (aiTypeLower.includes('triple')) aiType = 'triple_riding';
        else if (aiTypeLower.includes('park')) aiType = 'wrong_parking';
        else if (aiTypeLower.includes('speed')) aiType = 'overspeeding';
        else if (aiTypeLower.includes('red')) aiType = 'red_light';
        else if (aiTypeLower.includes('none')) aiType = 'none';
        
        setViolationType(aiType);
        if (result.data.locationDetails) setLocation(result.data.locationDetails);
        if (result.data.additionalNotes) setAdditionalNotes(result.data.additionalNotes);
        
        // Generate a random 10-digit mobile number for testing if not set
        const randomMobile = '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        setViolatorMobile(randomMobile);
        
        setStep(2); // Only advance to Step 2 if AI succeeded
      }
    } catch (err: any) {
      console.error('AI Analysis Failed:', err);
      // Show error to the user so it doesn't fail silently
      alert('AI Analysis Failed: ' + (err.response?.data?.message || err.message || 'Check your API Key or Network'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="max-w-md mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : window.history.back()} className="p-2 -ml-2 text-primary-500 hover:text-primary-600 bg-surface/30 rounded-full backdrop-blur-sm">
          <ChevronLeft />
        </button>
        <h1 className="text-xl font-bold text-text">Capture Violation</h1>
        <div className="w-10" />
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-border/50 rounded-full -z-10" />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full -z-10 transition-all duration-500" style={{ width: `calc(${((step - 1) / 2) * 100}% - 32px)` }} />
        
        {steps.map(s => (
          <div key={s.num} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
              step >= s.num ? 'bg-primary-500 text-white shadow-primary-500/30' : 'bg-surface border-2 border-border/50 text-muted backdrop-blur-md'
            }`}>
              {step > s.num ? <CheckCircle size={20} /> : s.num}
            </div>
            <span className={`text-[11px] mt-2 font-bold uppercase tracking-wider ${step >= s.num ? 'text-primary-500' : 'text-muted'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col glass-card border-dashed border-2 border-primary-500/30 overflow-hidden relative group">
              {image ? (
                <div className="relative w-full h-full min-h-[350px]">
                  <img src={image} alt="Captured" className="w-full h-full object-cover" />
                  <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-md shadow-lg flex items-center gap-2 hover:bg-black/80 transition-colors">
                     Retake
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-primary-500/5">
                  <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <Camera className="text-primary-500" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text">Capture Photo</h3>
                  <p className="text-sm text-muted mb-10 font-medium px-4">Ensure the vehicle number plate is clearly visible in the frame.</p>
                  
                  <div className="w-full space-y-4 px-4">
                    <div className="relative">
                      <Input type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="absolute inset-0 opacity-0 cursor-pointer h-full z-10" />
                      <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-primary-500/20 rounded-xl" size="lg">
                        <Camera className="mr-2" size={22} /> Take Photo
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <Input type="file" accept="image/*" onChange={handleImageCapture} className="absolute inset-0 opacity-0 cursor-pointer h-full z-10" />
                      <Button variant="outline" className="w-full h-12 font-semibold bg-surface/50 backdrop-blur-sm border-border/50 rounded-xl" size="lg">
                        <ImageIcon className="mr-2" size={18} /> Choose from Gallery
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center text-sm font-semibold text-muted bg-surface/40 py-3 rounded-xl border border-border/50">
              <MapPin size={18} className="mr-2 text-primary-500 animate-pulse" />
              <span>Auto-capturing GPS location...</span>
            </div>

            <Button className="w-full mt-6 h-14 text-lg font-bold rounded-xl shadow-lg" onClick={handleNextStep1} disabled={!image || isAnalyzing}>
              {isAnalyzing ? 'Analyzing Image...' : <><span className="mr-2">Next Step</span> <ChevronRight size={20} /></>}
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
            <div className="space-y-5 flex-1 p-2">
              <div className="glass p-5 rounded-xl border-border/50">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Registration Number</label>
                <Input value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="e.g. UP32AB1234" className="uppercase h-14 text-xl font-plate tracking-widest bg-bg/50 border-border/50 rounded-lg text-center" />
                <p className="text-xs text-info font-medium mt-3 flex items-center gap-1 justify-center"><AlertCircle size={14} /> Leave blank to let AI auto-detect</p>
              </div>
              
              <div className="glass p-5 rounded-xl border-border/50">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Violation Type (Optional)</label>
                <select value={violationType} onChange={e => setViolationType(e.target.value)} className="w-full h-14 rounded-lg border border-border/50 bg-bg/50 px-4 text-base font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500 appearance-none">
                  <option value="">Let AI Detect (Recommended)</option>
                  <option value="none">No Violation Detected</option>
                  <option value="no_helmet">No Helmet</option>
                  <option value="triple_riding">Triple Riding</option>
                  <option value="wrong_parking">Wrong Parking</option>
                  <option value="overspeeding">Overspeeding</option>
                  <option value="red_light">Red Light Jump</option>
                </select>
              </div>
              
              <div className="glass p-5 rounded-xl border-border/50">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Violator Mobile Number (For Testing SMS)</label>
                <Input type="tel" value={violatorMobile} onChange={e => setViolatorMobile(e.target.value)} placeholder="e.g. 9876543210" className="h-12 bg-bg/50 border-border/50 rounded-lg" />
                <p className="text-[10px] text-muted mt-2">Entering a number here will send a mock warning SMS to this number.</p>
              </div>

              <div className="glass p-5 rounded-xl border-border/50">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Location Details</label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Hazratganj intersection" className="h-12 bg-bg/50 border-border/50 rounded-lg" />
                
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mt-4 mb-2">Additional Notes</label>
                <textarea 
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-bg/50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500" 
                  rows={3} 
                  placeholder="Any other relevant details..."
                />
              </div>
            </div>

            <Button className="w-full mt-6 h-14 text-lg font-bold rounded-xl shadow-lg" onClick={() => setStep(3)}>
              Review Submission <ChevronRight size={20} className="ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              <div className="w-full h-56 bg-bg rounded-xl overflow-hidden border-2 border-border/50 relative shadow-md">
                {image && <img src={image} alt="Review" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-plate text-xl tracking-widest">{regNumber || 'AI DETECTION PENDING'}</p>
                </div>
              </div>
              
              <div className="glass-card">
                <div className="p-5 space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-border/30 pb-3">
                    <span className="text-muted font-bold uppercase text-xs tracking-wider">Reg. Number</span>
                    <span className="font-plate text-base">{regNumber || 'AI will detect'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/30 pb-3">
                    <span className="text-muted font-bold uppercase text-xs tracking-wider">Violation Type</span>
                    <span className="font-bold text-danger">{violationType || 'AI will detect'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/30 pb-3">
                    <span className="text-muted font-bold uppercase text-xs tracking-wider">Location</span>
                    <span className="font-medium">{location || 'GPS: 26.8467, 80.9462'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-bold uppercase text-xs tracking-wider">Timestamp</span>
                    <span className="font-medium bg-surface/50 px-2 py-1 rounded">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-info/10 text-info p-4 rounded-xl text-sm flex gap-3 border border-info/20 shadow-inner">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">AI analysis has verified the plate number and violation type. Please confirm the details above before submitting to the Command Center.</p>
              </div>
            </div>

            <Button disabled={submitStatus !== 'idle'} className={`w-full mt-8 h-14 text-lg font-bold shadow-lg rounded-xl transition-all duration-300 ${submitStatus === 'success_sms' || submitStatus === 'success_queue' ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' : 'shadow-primary-500/30'}`} onClick={handleSubmit}>
              {submitStatus === 'submitting' ? 'Processing Violation...' : 
               submitStatus === 'success_sms' ? 'Warning msg sent to person ✅' :
               submitStatus === 'success_queue' ? 'Sent to District Admin for action ✅' :
               'Submit Violation'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
