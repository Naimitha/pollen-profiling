import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  isLoading
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelect(null as any);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-emerald-400 bg-emerald-50 scale-105'
              : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-50/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                <Upload className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 mb-3">
                Drop your pollen image here
              </p>
              <p className="text-gray-600 mb-4">
                or click to browse your files
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                <span className="text-sm font-medium text-emerald-700">
                  Supports JPG, PNG, WebP • Max 10MB
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="relative">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected pollen sample"
                className="w-full h-80 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg hover:scale-110"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {selectedImage.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;