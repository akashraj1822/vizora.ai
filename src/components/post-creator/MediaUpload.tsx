import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { MediaItem } from '../../types';
import { Button } from '../common/Button';

interface MediaUploadProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  maxFiles?: number;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ 
  media, 
  onMediaChange, 
  maxFiles = 10 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newMedia: MediaItem[] = [];
    Array.from(files).forEach((file, index) => {
      if (media.length + newMedia.length >= maxFiles) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaItem: MediaItem = {
          id: Date.now().toString() + index,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: e.target?.result as string,
          alt: file.name,
          size: file.size
        };
        newMedia.push(mediaItem);
        
        if (newMedia.length === Math.min(files.length, maxFiles - media.length)) {
          onMediaChange([...media, ...newMedia]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeMedia = (id: string) => {
    onMediaChange(media.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Media</h3>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop your files here, or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Support for images (PNG, JPG, WebP) and videos (MP4, MOV)
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Media Preview */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
              </div>
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {item.type === 'video' ? 'Video' : 'Image'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};