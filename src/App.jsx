import React, { useState } from 'react';
import HomeModule from './components/HomeModule';
import LibraryModule from './components/LibraryModule';
import PracticeModule from './components/PracticeModule';
import StatsModule from './components/StatsModule';
import SettingsModule from './components/SettingsModule';
import Navigation from './components/Navigation';
import { getSettings } from './services/storage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [practiceVerseId, setPracticeVerseId] = useState(null);

  const navigateToPractice = (verseId) => {
    setPracticeVerseId(verseId);
    setActiveTab('practice');
  };

  const renderHeader = () => {
    const titles = {
      home: { title: 'Daily Verses', desc: '매일 꾸준히 암송해보세요' },
      library: { title: 'Bible Library', desc: '카테고리별 성경 구절 모음' },
      practice: { title: 'Practice Room', desc: '단계별로 확실하게 외워보세요' },
      stats: { title: 'My Stats', desc: '나의 성장 기록' },
      settings: { title: 'Settings', desc: '앱 환경설정' }
    };
    return (
      <header className="pt-10 pb-4 px-6 bg-[#FAFAFC] z-10 flex-shrink-0">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {titles[activeTab]?.title}
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          {titles[activeTab]?.desc}
        </p>
      </header>
    );
  };

  return (
    <div className={`max-w-md mx-auto h-screen shadow-xl bg-[#FAFAFC] overflow-hidden flex flex-col relative ${getSettings().textSize === 'large' ? 'text-lg' : 'text-base'}`}>
      {renderHeader()}
      
      <main className="flex-1 overflow-hidden">
        {activeTab === 'home' && <HomeModule onStartPractice={navigateToPractice} />}
        {activeTab === 'library' && <LibraryModule onStartPractice={navigateToPractice} />}
        {activeTab === 'practice' && <PracticeModule verseId={practiceVerseId} />}
        {activeTab === 'stats' && <StatsModule />}
        {activeTab === 'settings' && <SettingsModule />}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
