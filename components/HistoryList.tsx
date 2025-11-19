import React from 'react';
import { JournalEntry } from '../types';
import { Trash2, Calendar } from 'lucide-react';

interface HistoryListProps {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        <p>No entries yet. Start by writing about your day!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => onDelete(entry.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                aria-label="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-gray-800 mb-4 line-clamp-3 whitespace-pre-wrap font-light text-lg">
              {entry.text}
            </p>

            {entry.analysis && (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between text-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.analysis.colorHex }}
                  />
                  <span className="font-medium text-gray-700">{entry.analysis.shortSummary}</span>
                </div>
                <div className="flex space-x-2">
                  {entry.analysis.emotionalTone.slice(0, 2).map((t, i) => (
                     <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};