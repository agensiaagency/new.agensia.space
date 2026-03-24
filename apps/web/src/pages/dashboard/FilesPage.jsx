
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { 
  UploadCloud, Trash2, Image as ImageIcon, FileText, 
  X, Folder, Link as LinkIcon, Eye, CheckCircle, 
  AlertCircle, Loader2, File, Copy
} from 'lucide-react';

export default function FilesPage({ specificUserId }) {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('alle');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const QUOTA = 1 * 1024 * 1024 * 1024; // 1 GB

  const fetchFiles = useCallback(async () => {
    try {
      let filterStr = '';
      if (specificUserId) {
        filterStr = `user_id = "${specificUserId}"`;
      } else if (!isAdmin) {
        filterStr = `user_id = "${user.id}"`;
      }

      const records = await pb.collection('uploaded_files').getFullList({ 
        filter: filterStr, 
        sort: '-created', 
        $autoCancel: false 
      });
      setFiles(records);
    } catch (error) { 
      console.error('Error fetching files:', error); 
      toast({ title: "Fehler beim Laden der Dateien", variant: "destructive" });
    }
  }, [user, isAdmin, specificUserId, toast]);

  useEffect(() => { 
    if (user) fetchFiles(); 
  }, [fetchFiles, user]);

  // --- Upload Logic ---
  const processFiles = async (selectedFilesList) => {
    const newQueueItems = [];
    const validFiles = [];

    Array.from(selectedFilesList).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({ 
          title: "Datei zu groß", 
          description: `${file.name} überschreitet das Limit von 50 MB.`, 
          variant: "destructive" 
        });
        return;
      }
      
      const queueId = Math.random().toString(36).substring(7);
      newQueueItems.push({
        id: queueId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading'
      });
      validFiles.push({ file, queueId });
    });

    if (validFiles.length === 0) return;

    setUploadQueue(prev => [...prev, ...newQueueItems]);

    for (const { file, queueId } of validFiles) {
      // Simulate progress for better UX since PB SDK doesn't have native progress callback
      const progressInterval = setInterval(() => {
        setUploadQueue(prev => prev.map(item => {
          if (item.id === queueId && item.progress < 90) {
            return { ...item, progress: item.progress + Math.floor(Math.random() * 15) + 5 };
          }
          return item;
        }));
      }, 200);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', specificUserId || user.id);
        formData.append('filename', file.name);
        formData.append('file_size', file.size);
        formData.append('file_type', file.type);
        
        await pb.collection('uploaded_files').create(formData, { $autoCancel: false });
        
        clearInterval(progressInterval);
        setUploadQueue(prev => prev.map(item => 
          item.id === queueId ? { ...item, progress: 100, status: 'done' } : item
        ));
        
      } catch (error) {
        clearInterval(progressInterval);
        setUploadQueue(prev => prev.map(item => 
          item.id === queueId ? { ...item, status: 'error' } : item
        ));
        toast({ title: `Fehler bei ${file.name}`, variant: "destructive" });
      }
    }

    fetchFiles();
    
    // Clean up done/error items after 3 seconds
    setTimeout(() => {
      setUploadQueue(prev => prev.filter(item => item.status === 'uploading'));
    }, 3000);
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // --- Actions ---
  const toggleSelect = (id) => {
    setSelectedFiles(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  };

  const handleDeleteSingle = async (id, filename) => {
    if (window.confirm(`Möchtest du "${filename}" wirklich löschen?`)) {
      try {
        await pb.collection('uploaded_files').delete(id, { $autoCancel: false });
        setFiles(prev => prev.filter(f => f.id !== id));
        setSelectedFiles(prev => prev.filter(fId => fId !== id));
        toast({ title: "Datei gelöscht", className: "bg-[#10b981] text-white border-none" });
      } catch (error) {
        toast({ title: "Fehler beim Löschen", variant: "destructive" });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`${selectedFiles.length} Dateien wirklich löschen?`)) {
      try {
        for (const id of selectedFiles) {
          await pb.collection('uploaded_files').delete(id, { $autoCancel: false });
        }
        setSelectedFiles([]);
        fetchFiles();
        toast({ title: "Dateien gelöscht", className: "bg-[#10b981] text-white border-none" });
      } catch (error) {
        toast({ title: "Fehler beim Löschen", variant: "destructive" });
      }
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Link kopiert", className: "bg-[#c4a850] text-[#0a0f0d] border-none" });
  };

  // --- Helpers ---
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileCategory = (file) => {
    const type = file.file_type || '';
    const name = (file.filename || '').toLowerCase();
    
    if (name.includes('logo')) return 'logo';
    if (type.startsWith('image/')) return 'bilder';
    if (type.includes('pdf') || type.includes('document') || type.includes('msword')) return 'dokumente';
    if (type.includes('text') || type.includes('csv')) return 'texte';
    return 'sonstiges';
  };

  // --- Derived State ---
  const totalSize = files.reduce((acc, f) => acc + (f.file_size || 0), 0);
  const usagePercent = Math.min((totalSize / QUOTA) * 100, 100);
  const isNearLimit = usagePercent > 80;

  const filteredFiles = files.filter(file => {
    if (activeTab === 'alle') return true;
    return getFileCategory(file) === activeTab;
  });

  const tabs = [
    { id: 'alle', label: 'Alle Dateien' },
    { id: 'logo', label: 'Logos' },
    { id: 'bilder', label: 'Bilder' },
    { id: 'dokumente', label: 'Dokumente' },
    { id: 'texte', label: 'Texte' },
    { id: 'sonstiges', label: 'Sonstiges' }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header & Quota */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#e8e4df] mb-3">Dateien</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
            <span className="text-[#888888]">Speicherplatz: {formatSize(totalSize)} von 1 GB</span>
            <div className="w-48 h-2 bg-[#141210] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                className={`h-full transition-colors duration-500 ${isNearLimit ? 'bg-red-500' : 'bg-[#c4a850]'}`} 
              />
            </div>
            {isNearLimit && <span className="text-red-400 text-xs font-medium">Fast voll</span>}
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {selectedFiles.length > 0 && (
            <button 
              onClick={handleBulkDelete} 
              className="flex-1 md:flex-none px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors min-h-[44px]"
            >
              {selectedFiles.length} Löschen
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[200px]
          ${isDragging 
            ? 'border-[#c4a850] bg-[rgba(196,168,80,0.05)] scale-[1.01]' 
            : 'border-[rgba(196,168,80,0.2)] bg-[#0d0d0f] hover:border-[#c4a850]/50 hover:bg-[rgba(196,168,80,0.02)]'
          }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${isDragging ? 'bg-[#c4a850] text-[#08080a]' : 'bg-[rgba(196,168,80,0.1)] text-[#c4a850]'}`}>
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-medium text-[#e8e4df] mb-2">Dateien hier ablegen</h3>
        <p className="text-sm text-[#888888] max-w-md mx-auto">
          Ziehe deine Dateien hierher oder klicke, um sie auszuwählen. <br/>
          Maximale Dateigröße: 50 MB.
        </p>
        <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      </div>

      {/* Upload Queue */}
      <AnimatePresence>
        {uploadQueue.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 space-y-3 overflow-hidden"
          >
            <h4 className="text-sm font-medium text-[#e8e4df] mb-3">Uploads</h4>
            {uploadQueue.map(item => (
              <div key={item.id} className="bg-[#0d0d0f] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#e8e4df] truncate pr-4">{item.name}</span>
                    <span className="text-xs text-[#888888] whitespace-nowrap">{formatSize(item.size)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#141210] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`h-full ${item.status === 'error' ? 'bg-red-500' : 'bg-[#c4a850]'}`}
                    />
                  </div>
                </div>
                <div className="w-8 flex justify-center shrink-0">
                  {item.status === 'uploading' && <Loader2 size={18} className="text-[#c4a850] animate-spin" />}
                  {item.status === 'done' && <CheckCircle size={18} className="text-green-500" />}
                  {item.status === 'error' && <AlertCircle size={18} className="text-red-500" />}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-h-[44px]
              ${activeTab === tab.id 
                ? 'bg-[rgba(196,168,80,0.1)] border border-[#c4a850] text-[#c4a850]' 
                : 'bg-[#0d0d0f] border border-[rgba(255,255,255,0.05)] text-[#888888] hover:text-[#e8e4df] hover:border-[rgba(196,168,80,0.3)]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* File Grid / Empty State */}
      {filteredFiles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]"
        >
          <div className="w-20 h-20 bg-[rgba(255,255,255,0.02)] rounded-full flex items-center justify-center mb-6">
            <FileText size={32} className="text-[#5e6680]" />
          </div>
          <h3 className="text-xl font-serif text-[#e8e4df] mb-2">Noch keine Dateien</h3>
          <p className="text-[#888888] max-w-sm mb-8">
            {activeTab === 'alle' 
              ? 'Lade deine ersten Dateien hoch, um sie hier zu verwalten.' 
              : `Keine Dateien in der Kategorie "${tabs.find(t => t.id === activeTab)?.label}" gefunden.`}
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-[#c4a850] text-[#08080a] rounded-xl font-medium hover:bg-[#d4bc6a] transition-colors min-h-[44px]"
          >
            Erste Datei hochladen
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredFiles.map(file => {
              const fileUrl = pb.files.getUrl(file, file.file);
              const isImg = file.file_type?.startsWith('image/');
              const isSelected = selectedFiles.includes(file.id);

              return (
                <motion.div 
                  key={file.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-[#0d0d0f] rounded-xl overflow-hidden group relative transition-all duration-300
                    ${isSelected 
                      ? 'border-2 border-[#c4a850] shadow-[0_0_15px_rgba(196,168,80,0.15)]' 
                      : 'border border-[rgba(196,168,80,0.12)] hover:border-[#c4a850]/50 hover:shadow-lg'
                    }`}
                >
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3 z-20">
                    <div 
                      onClick={(e) => { e.stopPropagation(); toggleSelect(file.id); }}
                      className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors
                        ${isSelected ? 'bg-[#c4a850] border-[#c4a850]' : 'bg-[#08080a]/80 border-[rgba(255,255,255,0.3)] hover:border-[#c4a850]'}`}
                    >
                      {isSelected && <CheckCircle size={14} className="text-[#08080a]" />}
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="h-40 bg-[#141210] flex items-center justify-center relative overflow-hidden">
                    {isImg ? (
                      <img src={fileUrl} alt={file.filename} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <File size={40} className="text-[#c4a850] opacity-40" />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#08080a]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm z-10">
                      {isImg && (
                        <button 
                          onClick={() => setLightboxImage(fileUrl)}
                          className="w-10 h-10 bg-[#141210] text-[#e8e4df] rounded-full flex items-center justify-center hover:text-[#c4a850] hover:scale-110 transition-all"
                          title="Vorschau"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleCopyLink(fileUrl)}
                        className="w-10 h-10 bg-[#141210] text-[#e8e4df] rounded-full flex items-center justify-center hover:text-[#c4a850] hover:scale-110 transition-all"
                        title="Link kopieren"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSingle(file.id, file.filename)}
                        className="w-10 h-10 bg-[#141210] text-[#e8e4df] rounded-full flex items-center justify-center hover:text-red-400 hover:scale-110 transition-all"
                        title="Löschen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                    <h4 className="font-sans text-sm font-medium text-[#e8e4df] truncate mb-1.5" title={file.filename}>
                      {file.filename}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-[#888888]">
                      <span>{formatSize(file.file_size)}</span>
                      <span>{new Date(file.created).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#08080a]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8" 
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-[#141210] border border-[rgba(255,255,255,0.1)] text-[#e8e4df] rounded-full flex items-center justify-center hover:text-[#c4a850] hover:border-[#c4a850] transition-colors z-50"
              onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImage} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
