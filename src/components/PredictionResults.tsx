import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Analyzing image...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Prediction Failed</h3>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">Prediction Results</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Predicted Class</p>
              <p className="text-xl font-bold text-green-700">{result.class}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Confidence</p>
              <p className="text-xl font-bold text-green-700">
                {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {result.probabilities && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <h4 className="font-medium text-gray-900">All Predictions</h4>
            </div>
            <div className="space-y-2">
              {Object.entries(result.probabilities)
                .sort(([, a], [, b]) => b - a)
                .map(([className, probability]) => (
                  <div key={className} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {className.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${probability * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12 text-right">
                        {(probability * 100).toFixed(1)}%
                      </span>
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