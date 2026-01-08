
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onResetKey: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, onToggleTheme, onResetKey }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const navItems = [
    { icon: 'fas fa-th-large', label: 'Dashboard' },
    { icon: 'fas fa-video', label: 'Generate Video', active: true },
    { icon: 'fas fa-layer-group', label: 'Templates' },
    { icon: 'fas fa-folder-open', label: 'My Projects' },
    { icon: 'fas fa-history', label: 'History' },
    { icon: 'fas fa-images', label: 'Assets Library' },
    { icon: 'fas fa-cog', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Side Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform 
          ${isNavOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0 md:translate-x-0'} 
          ${isDarkMode ? 'bg-neutral-900 border-r border-neutral-800' : 'bg-neutral-100 border-r border-neutral-200'}
          flex flex-col shadow-2xl`}
      >
        <div className="p-6 flex items-center justify-between">
          {isNavOpen ? (
            <div className="flex items-center">
              <i className="fas fa-crown text-red-600 text-xl mr-3"></i>
              <span className="font-bold tracking-widest text-lg">VIA STUDIO</span>
            </div>
          ) : (
            <i className="fas fa-crown text-red-600 text-2xl mx-auto"></i>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center p-3 rounded-xl transition-all group
                ${item.active 
                  ? 'bg-red-600 text-white' 
                  : `${isDarkMode ? 'text-gray-400 hover:bg-neutral-800 hover:text-white' : 'text-gray-600 hover:bg-neutral-200 hover:text-black'}`
                }`}
            >
              <i className={`${item.icon} w-6 text-lg ${!isNavOpen && 'mx-auto'}`}></i>
              {isNavOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
           <button 
             onClick={onResetKey}
             className={`w-full flex items-center p-3 rounded-xl text-gray-500 hover:text-red-400 transition-colors
               ${!isNavOpen && 'justify-center'}`}
           >
             <i className="fas fa-sign-out-alt"></i>
             {isNavOpen && <span className="ml-3 text-sm">Switch API Key</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isNavOpen ? 'pl-64' : 'pl-20'}`}>
        {/* Top App Bar */}
        <header className={`h-16 flex items-center justify-between px-6 sticky top-0 z-40
          ${isDarkMode ? 'bg-black/80 border-b border-neutral-800' : 'bg-white/80 border-b border-neutral-200'} backdrop-blur-md`}>
          <div className="flex items-center">
            <button 
              onClick={() => setIsNavOpen(!isNavOpen)}
              className={`p-2 rounded-lg hover:bg-opacity-10 ${isDarkMode ? 'hover:bg-white text-gray-400' : 'hover:bg-black text-gray-600'}`}
            >
              <i className={`fas ${isNavOpen ? 'fa-indent' : 'fa-outdent'} text-lg`}></i>
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
              <button 
                onClick={onToggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-red-600' : 'bg-neutral-300'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Creative Director</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/via/100/100" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-transparent relative">
          {children}
        </main>
      </div>
    </div>
  );
};
