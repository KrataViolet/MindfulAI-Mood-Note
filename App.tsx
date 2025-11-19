import React, { useState, useEffect } from 'react';
import { JournalEditor } from './components/JournalEditor';
import { AnalysisCard } from './components/AnalysisCard';
import { HistoryList } from './components/HistoryList';
import { AnalyticsChart } from './components/AnalyticsChart';
import { Button } from './components/Button';
import { analyzeMood } from './services/geminiService';
import { JournalEntry, MoodAnalysis, ViewState } from './types';
import { BookOpen, LineChart, PenTool, BrainCircuit, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  // Load from local storage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('mindfulAI_entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Failed to parse entries", e);
      }
    }
  }, []);

  // Save to local storage whenever entries change
  useEffect(() => {
    localStorage.setItem('mindfulAI_entries', JSON.stringify(entries));
  }, [entries]);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    
    try {
      const analysis = await analyzeMood(text);
      setCurrentAnalysis(analysis);
      
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        text,
        analysis
      };
      
      setEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Sorry, we couldn't analyze your mood right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              MindfulAI
            </span>
          </div>

          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setView(ViewState.HOME)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === ViewState.HOME ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-1">
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </div>
            </button>
            <button
              onClick={() => setView(ViewState.HISTORY)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === ViewState.HISTORY ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
               <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </div>
            </button>
            <button
              onClick={() => setView(ViewState.ANALYTICS)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === ViewState.ANALYTICS ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
               <div className="flex items-center space-x-1">
                <LineChart className="w-4 h-4" />
                <span className="hidden sm:inline">Trends</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* HOME VIEW */}
        {view === ViewState.HOME && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                How are you feeling today?
              </h1>
              <p className="text-lg text-gray-500">
                Take a moment to reflect. AI is here to listen and support you.
              </p>
            </div>

            <JournalEditor onSubmit={handleAnalyze} isAnalyzing={isAnalyzing} />

            {currentAnalysis && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Insights</h2>
                <AnalysisCard analysis={currentAnalysis} />
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={() => { setCurrentAnalysis(null); setView(ViewState.HISTORY); }}>
                    View in History
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Intro Features if no analysis yet */}
            {!currentAnalysis && !isAnalyzing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center opacity-80">
                <div className="p-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BrainCircuit className="text-blue-500 w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
                  <p className="text-sm text-gray-500 mt-2">Get instant sentiment analysis and emotional breakdown of your entries.</p>
                </div>
                <div className="p-4">
                   <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Moon className="text-pink-500 w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Empathetic Feedback</h3>
                  <p className="text-sm text-gray-500 mt-2">Receive gentle, psychological support tailored to your current mood.</p>
                </div>
                <div className="p-4">
                   <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LineChart className="text-green-500 w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Track Your Journey</h3>
                  <p className="text-sm text-gray-500 mt-2">Visualize your emotional trends over time to better understand yourself.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY VIEW */}
        {view === ViewState.HISTORY && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Journal History</h2>
            <HistoryList entries={entries} onDelete={handleDelete} />
          </div>
        )}

        {/* ANALYTICS VIEW */}
        {view === ViewState.ANALYTICS && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emotional Trends</h2>
            <AnalyticsChart entries={entries} />
            
            {/* Basic Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-indigo-600">{entries.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Entries</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-green-500">
                   {entries.length > 0 ? (entries.reduce((acc, curr) => acc + (curr.analysis?.sentimentScore || 0), 0) / entries.length).toFixed(1) : '-'}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Avg Mood</p>
              </div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-pink-500">
                   {entries.filter(e => (e.analysis?.sentimentScore || 0) > 7).length}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Great Days</p>
              </div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-orange-500">
                   {entries.filter(e => (e.analysis?.sentimentScore || 0) < 4).length}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Tough Days</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;