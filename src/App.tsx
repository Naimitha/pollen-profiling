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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Brazilian Savannah Pollen Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a pollen grain image and let our specialized machine learning model identify 
            species from the Brazilian Cerrado region with scientific accuracy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Pollen Image</h3>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                isLoading={isLoading}
              />
            </div>

            {selectedImage && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Process</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-green-600">1</span>
                    </div>
                    <p>Pollen grain image is preprocessed and enhanced for analysis</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-green-600">2</span>
                    </div>
                    <p>Specialized CNN model trained on Cerrado flora analyzes morphological features</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-green-600">3</span>
                    </div>
                    <p>Species identification with confidence scores based on taxonomic classification</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <PredictionResults
              result={predictionResult}
              isLoading={isLoading}
              error={error}
            />

            {!selectedImage && !isLoading && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🌾</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready for Pollen Analysis
                </h3>
                <p className="text-gray-600">
                  Upload a microscopic pollen grain image to identify species from the Brazilian 
                  Cerrado savannah. Get scientific classifications with confidence scores.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              About Brazilian Cerrado Pollen Classification
            </h3>
            <div className="text-left space-y-4">
              <p className="text-gray-600">
                The Brazilian Cerrado is one of the world's most biodiverse savannas, home to over 
                12,000 plant species. This specialized ML model has been trained to identify pollen 
                grains from key Cerrado species including:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Trees & Shrubs</h4>
                  <ul className="space-y-1">
                    <li>• <em>Qualea grandiflora</em> (Pau-terra)</li>
                    <li>• <em>Dipteryx alata</em> (Baru)</li>
                    <li>• <em>Hancornia speciosa</em> (Mangaba)</li>
                    <li>• <em>Tabebuia aurea</em> (Paratudo)</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Palms & Herbs</h4>
                  <ul className="space-y-1">
                    <li>• <em>Mauritia flexuosa</em> (Buriti)</li>
                    <li>• <em>Vellozia squamata</em> (Canela-de-ema)</li>
                    <li>• <em>Curatella americana</em> (Lixeira)</li>
                    <li>• <em>Byrsonima verbascifolia</em> (Murici)</li>
                  </ul>
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