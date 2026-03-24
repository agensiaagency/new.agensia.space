
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Check, X, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DesignReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const imageRef = useRef(null);

  const [review, setReview] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pin creation state
  const [activePin, setActivePin] = useState(null);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [reviewData, feedbackData] = await Promise.all([
        api.design_reviews.getOne(id),
        api.design_feedback.getByReview(id)
      ]);
      setReview(reviewData);
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Error fetching review:', error);
      toast({ title: "Fehler", description: "Review nicht gefunden.", variant: "destructive" });
      navigate('/dashboard/overview');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setActivePin({ x, y });
  };

  const submitFeedback = async () => {
    if (!newFeedbackText.trim() || !activePin) return;
    
    setIsSubmitting(true);
    try {
      const newFeedback = await api.design_feedback.create({
        review_id: id,
        user_id: user.id,
        content: newFeedbackText,
        pin_x: activePin.x,
        pin_y: activePin.y,
        status: 'offen'
      });
      
      const feedbackWithUser = { ...newFeedback, expand: { user_id: user } };
      setFeedbacks([...feedbacks, feedbackWithUser]);
      setActivePin(null);
      setNewFeedbackText('');
      toast({ title: "Feedback gespeichert", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", description: "Konnte nicht gespeichert werden.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      await api.design_feedback.update(feedbackId, { status: newStatus });
      setFeedbacks(feedbacks.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f));
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  const approveDesign = async () => {
    try {
      await api.design_reviews.update(id, { status: 'genehmigt' });
      setReview({ ...review, status: 'genehmigt' });
      toast({ title: "Design freigegeben!", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!review) return null;

  const imageUrl = review.design_file ? pb.files.getUrl(review, review.design_file) : null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col pb-4">
      <DashboardHeader />
      
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-[#888888] hover:text-[#c4a850] transition-colors bg-[#141210] rounded-lg border border-[rgba(255,255,255,0.05)]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-serif text-[#e8e4df]">{review.title}</h1>
            <p className="text-xs text-[#888888]">Version {review.version} • {review.status}</p>
          </div>
        </div>
        
        {!isAdmin && review.status !== 'genehmigt' && (
          <button 
            onClick={approveDesign}
            className="flex items-center gap-2 bg-[#10b981] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#059669] transition-colors"
          >
            <Check size={16} /> Design freigeben
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Image Area */}
        <div className="flex-1 bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-auto relative custom-scrollbar">
          {imageUrl ? (
            <div className="relative inline-block min-w-full">
              <img 
                ref={imageRef}
                src={imageUrl} 
                alt="Design Review" 
                className="max-w-none cursor-crosshair"
                onClick={handleImageClick}
              />
              
              {/* Render existing pins */}
              {feedbacks.map((fb, index) => (
                <div 
                  key={fb.id}
                  className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center text-xs font-bold shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                    fb.status === 'erledigt' ? 'bg-green-500 text-white' : 'bg-[#c4a850] text-[#0a0f0d]'
                  }`}
                  style={{ left: `${fb.pin_x}%`, top: `${fb.pin_y}%` }}
                  title={fb.content}
                >
                  {index + 1}
                </div>
              ))}

              {/* Render active new pin */}
              {activePin && (
                <div 
                  className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-lg animate-bounce"
                  style={{ left: `${activePin.x}%`, top: `${activePin.y}%` }}
                >
                  <MapPin size={14} />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#888888]">
              Kein Bild hochgeladen.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          {/* New Feedback Form */}
          {activePin && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141210] border border-blue-500/30 rounded-xl p-4 shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-[#e8e4df]">Neues Feedback</h3>
                <button onClick={() => setActivePin(null)} className="text-[#888888] hover:text-[#e8e4df]"><X size={16} /></button>
              </div>
              <textarea 
                autoFocus
                value={newFeedbackText}
                onChange={e => setNewFeedbackText(e.target.value)}
                placeholder="Was soll hier geändert werden?"
                className="w-full bg-[#0a0f0d] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-blue-500 resize-none mb-3"
                rows={3}
              />
              <button 
                onClick={submitFeedback}
                disabled={isSubmitting || !newFeedbackText.trim()}
                className="w-full bg-blue-500 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                Speichern
              </button>
            </motion.div>
          )}

          {/* Feedback List */}
          <div className="flex-1 bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#0a0f0d]">
              <h3 className="font-medium text-[#e8e4df] flex items-center gap-2">
                <MessageSquare size={16} className="text-[#c4a850]" /> Feedback Liste
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {feedbacks.length === 0 ? (
                <p className="text-sm text-[#888888] text-center py-8">Klicke auf das Bild, um Feedback zu hinterlassen.</p>
              ) : (
                feedbacks.map((fb, index) => (
                  <div key={fb.id} className={`p-3 rounded-lg border ${fb.status === 'erledigt' ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] opacity-70' : 'bg-[#0a0f0d] border-[rgba(196,168,80,0.2)]'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${fb.status === 'erledigt' ? 'bg-green-500 text-white' : 'bg-[#c4a850] text-[#0a0f0d]'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm mb-2 ${fb.status === 'erledigt' ? 'text-[#888888] line-through' : 'text-[#e8e4df]'}`}>{fb.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#5e6680]">{fb.expand?.user_id?.name || 'User'}</span>
                          {isAdmin && fb.status !== 'erledigt' && (
                            <button 
                              onClick={() => updateFeedbackStatus(fb.id, 'erledigt')}
                              className="text-[10px] bg-[rgba(255,255,255,0.05)] hover:bg-green-500/20 hover:text-green-400 text-[#888888] px-2 py-1 rounded transition-colors"
                            >
                              Erledigt
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
