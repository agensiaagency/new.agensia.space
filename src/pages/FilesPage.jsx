import React, { useState, useEffect } from 'react';
import { UploadCloud, File, Image as ImageIcon, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

export default function FilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadFiles = () => {
    api.files.getByUser(user.id)
      .then(setFiles)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) loadFiles();
  }, [user]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (newFiles) => {
    setUploading(true);
    try {
      for (const file of Array.from(newFiles)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', user.id);
        formData.append('filename', file.name);
        formData.append('file_size', file.size);
        formData.append('file_type', file.type.startsWith('image/') ? 'image' : 'file');
        
        await api.files.create(formData);
      }
      loadFiles();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.files.delete(id);
      loadFiles();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="font-serif text-3xl text-[#edf0f7] mb-2">Dateien</h2>
      <p className="text-[#a8b0c5] mb-8">Lade hier Bilder, Dokumente oder andere Assets für dein Projekt hoch.</p>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-[20px] p-12 flex flex-col items-center justify-center text-center transition-all mb-10
          ${isDragging 
            ? 'border-[#d4a850] bg-[#d4a850]/5' 
            : 'border-[rgba(255,255,255,0.2)] hover:border-[#d4a850]/50 bg-[rgba(12,14,20,0.3)]'
          }
        `}
      >
        <UploadCloud size={48} className={`${isDragging ? 'text-[#d4a850]' : 'text-[#a8b0c5]'} mb-4`} />
        <p className="text-lg text-[#edf0f7] mb-2">Dateien hierher ziehen oder klicken</p>
        <p className="text-sm text-[#5e6680] mb-6">Maximal 20MB pro Datei</p>
        
        <label className="px-6 py-2 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all cursor-pointer">
          {uploading ? 'Wird hochgeladen...' : 'Dateien auswählen'}
          <input type="file" multiple className="hidden" onChange={handleFileInput} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-[#a8b0c5]">Lade Dateien...</div>
      ) : files.length > 0 && (
        <div>
          <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Hochgeladene Dateien</h3>
          <div className="space-y-3">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[12px]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#08090d] flex items-center justify-center text-[#d4a850]">
                    {file.file_type === 'image' ? <ImageIcon size={20} /> : <File size={20} />}
                  </div>
                  <div>
                    <a 
                      href={pb.files.getURL(file, file.file)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#edf0f7] font-medium hover:text-[#d4a850] transition-colors"
                    >
                      {file.filename}
                    </a>
                    <div className="text-xs text-[#5e6680]">
                      {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {new Date(file.created).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteFile(file.id)}
                  className="p-2 text-[#5e6680] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}