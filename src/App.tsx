import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PredictionResults from './components/PredictionResults';
import { uploadImageForPrediction } from './services/api';
import { PredictionResult } from './types';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File | null) => {
    if (!file) {
      setSelectedImage(null);
      setPredictionResult(null);
      setError(null);
      return;
    }

    setSelectedImage(file);
    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const response = await uploadImageForPrediction(file);
      
      if (response.success && response.prediction) {
        setPredictionResult(response.prediction);
      } else {
        setError(response.error || 'Failed to get pollen prediction');
      }
    } catch (err) {
      setError('Network error occurred during pollen analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-full mb-6 border border-emerald-800/30">
            <span className="text-sm font-semibold text-emerald-300">Advanced AI Classification</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Brazilian Savannah
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Pollen Analysis
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Upload a microscopic pollen grain image and let our specialized machine learning model identify 
            species from the Brazilian Cerrado region with scientific precision and detailed taxonomic classification.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-white">Upload Pollen Sample</h3>
              </div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                isLoading={isLoading}
              />
            </div>

            {selectedImage && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <h3 className="text-xl font-bold text-white">Analysis Pipeline</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">1</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Image Preprocessing</h4>
                      <p className="text-gray-300">Pollen grain image is enhanced and normalized for optimal analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Feature Extraction</h4>
                      <p className="text-gray-300">Specialized CNN analyzes morphological patterns unique to Cerrado flora</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-sm font-bold text-white">3</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Species Classification</h4>
                      <p className="text-gray-300">Taxonomic identification with confidence scores and probability distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <PredictionResults
              result={predictionResult}
              isLoading={isLoading}
              error={error}
            />

            {!selectedImage && !isLoading && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-800/30">
                  <span className="text-4xl">🔬</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready for Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Upload a high-resolution microscopic pollen grain image to begin species identification 
                  from the Brazilian Cerrado savannah ecosystem. Our AI model provides detailed scientific 
                  classifications with confidence metrics.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-12 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Brazilian Cerrado Biodiversity
              </h3>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                The Brazilian Cerrado is one of the world's most biodiverse savannas, home to over 
                12,000 plant species. Our specialized ML model identifies pollen from key species.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-2xl p-8 border border-emerald-800/30">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <h4 className="text-xl font-bold text-emerald-300">Trees & Shrubs</h4>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span><em className="font-medium text-emerald-200">Qualea grandiflora</em> (Pau-terra)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span><em className="font-medium text-emerald-200">Dipteryx alata</em> (Baru)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span><em className="font-medium text-emerald-200">Hancornia speciosa</em> (Mangaba)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span><em className="font-medium text-emerald-200">Tabebuia aurea</em> (Paratudo)</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-2xl p-8 border border-amber-800/30">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <h4 className="text-xl font-bold text-amber-300">Palms & Herbs</h4>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span><em className="font-medium text-amber-200">Mauritia flexuosa</em> (Buriti)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span><em className="font-medium text-amber-200">Vellozia squamata</em> (Canela-de-ema)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span><em className="font-medium text-amber-200">Curatella americana</em> (Lixeira)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span><em className="font-medium text-amber-200">Byrsonima verbascifolia</em> (Murici)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;