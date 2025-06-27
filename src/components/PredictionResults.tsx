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
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-800 border-t-emerald-400"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-1">Analyzing Pollen Sample</p>
            <p className="text-gray-300">Processing morphological features...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-800/50 p-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-900/50 rounded-xl border border-red-800/30">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-300 mb-2">Analysis Failed</h3>
            <p className="text-red-200 leading-relaxed">{error}</p>
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
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800/30">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
          <p className="text-gray-300">Species identification results</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className={`bg-gradient-to-br from-${confidenceColor}-900/30 to-${confidenceColor}-800/30 rounded-2xl p-6 border border-${confidenceColor}-800/30`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ConfidenceIcon className={`w-6 h-6 text-${confidenceColor}-400`} />
              <span className="text-sm font-semibold text-gray-300">Identified Species</span>
            </div>
            <div className={`px-3 py-1 bg-${confidenceColor}-900/50 rounded-full border border-${confidenceColor}-800/30`}>
              <span className={`text-sm font-bold text-${confidenceColor}-300`}>
                {(result.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
          </div>
          <h4 className={`text-2xl font-bold text-${confidenceColor}-200 italic`}>
            {result.class}
          </h4>
        </div>

        {result.probabilities && (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gray-700 rounded-lg border border-gray-600">
                <TrendingUp className="w-5 h-5 text-gray-300" />
              </div>
              <h4 className="text-lg font-bold text-white">Probability Distribution</h4>
            </div>
            <div className="space-y-4">
              {Object.entries(result.probabilities)
                .sort(([, a], [, b]) => b - a)
                .map(([className, probability], index) => (
                  <div key={className} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-200 italic">
                        {className}
                      </span>
                      <span className="text-sm font-bold text-gray-300">
                        {(probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ease-out ${
                            index === 0 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                              : index === 1
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                              : 'bg-gradient-to-r from-gray-500 to-gray-600'
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