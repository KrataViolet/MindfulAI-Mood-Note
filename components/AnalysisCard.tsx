import React from 'react';
import { MoodAnalysis } from '../types';
import { Heart, CheckCircle, Activity } from 'lucide-react';

interface AnalysisCardProps {
  analysis: MoodAnalysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      {/* Header Color Strip */}
      <div 
        className="h-3 w-full" 
        style={{ backgroundColor: analysis.colorHex }}
      ></div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Top Row: Score & Keywords */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-md"
              style={{ backgroundColor: analysis.colorHex }}
            >
              {analysis.sentimentScore}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analysis Result</h3>
              <p className="text-sm text-gray-500">{analysis.shortSummary}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {analysis.emotionalTone.map((tone, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {tone}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Empathetic Response */}
        <div className="prose prose-indigo">
          <div className="flex items-start space-x-3">
             <Heart className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
             <p className="text-gray-700 leading-relaxed italic">
               "{analysis.empatheticResponse}"
             </p>
          </div>
        </div>

        {/* Actionable Advice */}
        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
          <h4 className="flex items-center text-indigo-900 font-semibold mb-3">
            <Activity className="w-4 h-4 mr-2" />
            Suggestions for you
          </h4>
          <ul className="space-y-2">
            {analysis.actionableAdvice.map((advice, idx) => (
              <li key={idx} className="flex items-start text-sm text-indigo-800">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-indigo-500 flex-shrink-0" />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};