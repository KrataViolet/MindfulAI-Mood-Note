import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, Send } from 'lucide-react';

interface JournalEditorProps {
  onSubmit: (text: string) => void;
  isAnalyzing: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ onSubmit, isAnalyzing }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300">
      <label htmlFor="journal-input" className="block text-sm font-medium text-gray-700 mb-2">
        How are you feeling right now?
      </label>
      <textarea
        id="journal-input"
        className="w-full min-h-[150px] p-4 text-gray-800 text-lg placeholder-gray-400 bg-gray-50 rounded-xl border-none focus:ring-0 resize-y focus:bg-white transition-colors"
        placeholder="I'm feeling..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isAnalyzing}
      />
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-gray-400 hidden sm:block">
          Press <kbd className="font-sans px-1 border rounded bg-gray-100">Cmd</kbd> + <kbd className="font-sans px-1 border rounded bg-gray-100">Enter</kbd> to submit
        </p>
        <Button 
          onClick={handleSubmit} 
          disabled={!text.trim() || isAnalyzing}
          isLoading={isAnalyzing}
          icon={isAnalyzing ? <Sparkles className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          className="w-full sm:w-auto ml-auto"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}
        </Button>
      </div>
    </div>
  );
};