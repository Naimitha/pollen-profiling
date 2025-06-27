import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Award, Zap } from 'lucide-react';
import { PredictionResult } from '../types';

interface PredictionResultsProps {
  result: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  result,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-1">Analyzing Pollen Sample</p>
            <p className="text-gray-600">Processing morphological features...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Analysis Failed</h3>
            <p className="text-red-700 leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const confidenceColor = result.confidence >= 0.9 ? 'emerald' : result.confidence >= 0.7 ? 'amber' : 'orange';
  const confidenceIcon = result.confidence >= 0.9 ? Award : result.confidence >= 0.7 ? Zap : TrendingUp;
  const ConfidenceIcon = confidenceIcon;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Analysis Complete</h3>
          <p className="text-gray-600">Species identification results</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className={`bg-gradient-to-br from-${confidenceColor}-50 to-${confidenceColor}-100 rounded-2xl p-6 border border-${confidenceColor}-200`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ConfidenceIcon className={`w-6 h-6 text-${confidenceColor}-600`} />
              <span className="text-sm font-semibold text-gray-600">Identified Species</span>
            </div>
            <div className={`px-3 py-1 bg-${confidenceColor}-200 rounded-full`}>
              <span className={`text-sm font-bold text-${confidenceColor}-800`}>
                {(result.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
          </div>
          <h4 className={`text-2xl font-bold text-${confidenceColor}-900 italic`}>
            {result.class}
          </h4>
        </div>

        {result.probabilities && (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Probability Distribution</h4>
            </div>
            <div className="space-y-4">
              {Object.entries(result.probabilities)
                .sort(([, a], [, b]) => b - a)
                .map(([className, probability], index) => (
                  <div key={className} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 italic">
                        {className}
                      </span>
                      <span className="text-sm font-bold text-gray-600">
                        {(probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ease-out ${
                            index === 0 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                              : index === 1
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          style={{ 
                            width: `${probability * 100}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResults;