import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'library', label: '서재', icon: '📚' },
    { id: 'practice', label: '연습', icon: '✏️' },
    { id: 'stats', label: '성적표', icon: '📊' },
    { id: 'settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 flex justify-around py-3 pb-6 flex-shrink-0 relative z-20">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
