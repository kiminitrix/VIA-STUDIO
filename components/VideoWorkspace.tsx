
import React, { useState, useRef, useEffect } from 'react';
import { VideoRatio, GenerationSettings, VideoResolution, VideoStyle, GeneratedVideo } from '../types';
import { generateVideo } from '../services/geminiService';

interface VideoWorkspaceProps {
  isDarkMode: boolean;
}

export const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({ isDarkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoResult, setVideoResult] = useState<GeneratedVideo | null>(null);
  const [history, setHistory] = useState<GeneratedVideo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [settings, setSettings] = useState<GenerationSettings>({
    ratio: '16:9',
    resolution: '1080p',
    style: 'Cinematic',
    duration: '5s',
    fps: 24
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStatusMessage('Connecting to VIA neural servers...');

    try {
      const videoUrl = await generateVideo(
        prompt, 
        settings.ratio, 
        settings.resolution, 
        (msg) => setStatusMessage(msg)
      );

      const newVideo: GeneratedVideo = {
        id: Math.random().toString(36).substr(2, 9),
        url: videoUrl,
        prompt: prompt,
        ratio: settings.ratio,
        timestamp: Date.now(),
        status: 'completed'
      };

      setVideoResult(newVideo);
      setHistory(prev => [newVideo, ...prev]);
    } catch (error: any) {
      console.error("Generation failed", error);
      if (error.message === "API_KEY_EXPIRED_OR_INVALID") {
        alert("Your API session has expired. Please select your API key again.");
        window.location.reload();
      } else {
        alert("Generation failed: " + error.message);
      }
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  const updateSetting = <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Center Panel - Video Result */}
      <div className={`flex-1 flex flex-col items-center justify-center p-6 relative
        ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
        
        {isGenerating ? (
          <div className="w-full h-full max-w-4xl aspect-video bg-neutral-900 rounded-2xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden border border-neutral-800">
            {/* Visual background for loading */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent animate-pulse"></div>
            
            <div className="relative z-10 text-center px-8">
              <div className="mb-8 relative">
                 <div className="w-24 h-24 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                 <i className="fas fa-film absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight animate-pulse">Generating Masterpiece</h3>
              <p className="text-gray-400 text-sm font-medium tracking-wide uppercase italic">
                {statusMessage || "Processing Cinematic Logic..."}
              </p>
            </div>
          </div>
        ) : videoResult ? (
          <div className="w-full h-full max-w-4xl flex flex-col">
             <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 group relative">
                <video 
                  ref={videoRef}
                  key={videoResult.url}
                  src={videoResult.url} 
                  className={`w-full h-full object-contain ${settings.ratio === '9:16' ? 'aspect-[9/16]' : settings.ratio === '16:9' ? 'aspect-video' : 'aspect-square'}`}
                  autoPlay 
                  loop 
                  controls
                />
             </div>
             <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                   <button className="text-gray-400 hover:text-white transition-colors">
                      <i className="fas fa-redo-alt mr-2"></i> Regenerate
                   </button>
                   <button className="text-gray-400 hover:text-white transition-colors">
                      <i className="fas fa-share-alt mr-2"></i> Share
                   </button>
                </div>
                <button 
                   onClick={() => window.open(videoResult.url, '_blank')}
                   className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-neutral-700"
                >
                   <i className="fas fa-download mr-2"></i> Export High-Res
                </button>
             </div>
          </div>
        ) : (
          <div className="w-full h-full max-w-4xl flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-3xl group">
             <div className="p-12 text-center">
               <div className="w-20 h-20 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-800 group-hover:border-red-600/50 transition-colors">
                 <i className="fas fa-video text-3xl text-neutral-600 group-hover:text-red-600 transition-colors"></i>
               </div>
               <h3 className="text-2xl font-bold mb-2">Create Your Vision</h3>
               <p className="text-gray-500 max-w-sm">Enter a cinematic prompt and select your aspect ratio to begin generation.</p>
             </div>
          </div>
        )}
      </div>

      {/* Right Panel - Prompt & Settings */}
      <div className={`w-full md:w-96 p-6 border-l flex flex-col gap-6 overflow-y-auto
        ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
        
        {/* Prompt Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-xs font-bold uppercase tracking-widest text-red-500">Video Prompt</h4>
             <button className="text-xs text-gray-500 hover:text-white flex items-center">
               <i className="fas fa-wand-magic-sparkles mr-1"></i> Enhance
             </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic drone shot of a neon cyberpunk city during rain, 8k resolution, highly detailed..."
            className={`w-full h-40 p-4 rounded-xl text-sm resize-none outline-none transition-all
              ${isDarkMode 
                ? 'bg-black border border-neutral-800 focus:border-red-600' 
                : 'bg-neutral-100 border border-neutral-200 focus:border-red-600'}`}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {['Cinematic', 'Golden Hour', 'Wide Angle', '4K'].map(tag => (
              <button 
                key={tag}
                onClick={() => setPrompt(prev => prev + (prev ? ', ' : '') + tag)}
                className={`text-[10px] px-2 py-1 rounded-md border
                  ${isDarkMode ? 'border-neutral-800 bg-neutral-950 text-gray-500 hover:text-white' : 'border-neutral-200 bg-neutral-50 text-gray-500 hover:text-black'}`}
              >
                + {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Video Settings */}
        <section className="space-y-6">
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Aspect Ratio</h4>
              <div className="grid grid-cols-3 gap-2">
                 {(['16:9', '9:16', '1:1'] as VideoRatio[]).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => updateSetting('ratio', ratio)}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all border
                        ${settings.ratio === ratio 
                          ? 'bg-red-600 border-red-600 text-white' 
                          : `${isDarkMode ? 'bg-black border-neutral-800 text-gray-500 hover:border-neutral-600' : 'bg-neutral-50 border-neutral-200 text-gray-600 hover:border-neutral-300'}`
                        }`}
                    >
                       <div className={`border-2 border-current rounded-sm mb-2 
                         ${ratio === '16:9' ? 'w-6 h-3.5' : ratio === '9:16' ? 'w-3.5 h-6' : 'w-5 h-5'}`} />
                       <span className="text-[10px] font-bold">{ratio}</span>
                    </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Resolution</h4>
                 <select 
                   value={settings.resolution}
                   onChange={(e) => updateSetting('resolution', e.target.value as VideoResolution)}
                   className={`w-full p-3 rounded-lg text-sm outline-none border transition-all appearance-none
                     ${isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'}`}
                 >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                 </select>
              </div>
              <div>
                 <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Duration</h4>
                 <select 
                   value={settings.duration}
                   onChange={(e) => updateSetting('duration', e.target.value)}
                   className={`w-full p-3 rounded-lg text-sm outline-none border appearance-none
                     ${isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'}`}
                 >
                    <option value="5s">5 Seconds</option>
                    <option value="10s">10 Seconds</option>
                 </select>
              </div>
           </div>

           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Style Preset</h4>
              <select 
                value={settings.style}
                onChange={(e) => updateSetting('style', e.target.value as VideoStyle)}
                className={`w-full p-3 rounded-lg text-sm outline-none border appearance-none
                  ${isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'}`}
              >
                 <option value="Cinematic">Cinematic Pro</option>
                 <option value="Realistic">Photorealistic</option>
                 <option value="Anime">Anime Fusion</option>
                 <option value="Motion Graphic">Flat Motion</option>
              </select>
           </div>
        </section>

        {/* Generate Button */}
        <div className="mt-auto pt-6 border-t border-neutral-800">
           <button
             disabled={!prompt.trim() || isGenerating}
             onClick={handleGenerate}
             className={`w-full py-4 rounded-xl font-bold text-white transition-all transform flex items-center justify-center space-x-3
               ${!prompt.trim() || isGenerating 
                 ? 'bg-neutral-800 cursor-not-allowed text-neutral-600' 
                 : 'bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95'}`}
           >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-bolt"></i>
                  <span>GENERATE VIDEO</span>
                </>
              )}
           </button>
           <p className="text-[10px] text-center text-gray-500 mt-4 leading-relaxed">
             AI video generation consumes 1 credit per 5s.<br/>Estimated wait time: ~60s
           </p>
        </div>
      </div>
      
      {/* Off-canvas History Panel (Mini Overlay) */}
      {history.length > 0 && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 p-2 rounded-2xl flex space-x-2 border shadow-2xl z-50 transition-all backdrop-blur-md
          ${isDarkMode ? 'bg-black/80 border-neutral-800' : 'bg-white/80 border-neutral-200'}`}>
          <div className="px-4 border-r border-neutral-700 flex items-center">
             <span className="text-xs font-bold text-red-500 mr-2">HISTORY</span>
             <span className="bg-neutral-800 text-[10px] px-1.5 rounded">{history.length}</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto max-w-sm sm:max-w-xl pb-1">
            {history.map(vid => (
              <button 
                key={vid.id}
                onClick={() => setVideoResult(vid)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0
                  ${videoResult?.id === vid.id ? 'border-red-600 scale-110' : 'border-transparent hover:border-neutral-500'}`}
              >
                <img src={`https://picsum.photos/seed/${vid.id}/50/50`} className="w-full h-full object-cover" alt="History" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
