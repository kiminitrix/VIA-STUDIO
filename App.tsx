
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { VideoWorkspace } from './components/VideoWorkspace';

// Fix: Use the AIStudio named interface to match the environment's expected type
// This resolves the conflict where 'aistudio' was being redefined with a structural type
declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
  interface Window {
    readonly aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    } catch (e) {
      console.error("Auth check failed", e);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    // Proceed regardless of immediate result to avoid race condition
    setHasApiKey(true);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white p-6">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-crown text-4xl text-red-600 mr-3"></i>
            <h1 className="text-3xl font-bold tracking-tighter">VIA STUDIO</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Unlock Professional Video Gen</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            To use VIA STUDIO's cinematic AI capabilities, you must select a valid API key from a paid Google Cloud project.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Select API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-6 text-sm text-gray-500 hover:text-red-400 underline"
          >
            Learn about Gemini API billing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark bg-black' : 'bg-white'}>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <Layout 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme}
          onResetKey={() => setHasApiKey(false)}
        >
          <VideoWorkspace isDarkMode={isDarkMode} />
        </Layout>
      </div>
    </div>
  );
};

export default App;
