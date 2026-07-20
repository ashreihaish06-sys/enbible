import React, { useState, useEffect } from 'react';
import { getVerses } from '../services/verseService';
import { playTTS, stopTTS } from '../services/tts';
import { setLastReadVerseId } from '../services/storage';

const categorizeVerses = (verses) => {
  const categories = {
    '사랑 (Love)': [],
    '담대함 (Courage)': [],
    '평안 (Peace)': [],
    '믿음 (Faith)': [],
    '기타 (Others)': []
  };

  verses.forEach(verse => {
    const text = verse.nivText.toLowerCase();
    if (text.includes('love')) {
      categories['사랑 (Love)'].push(verse);
    } else if (text.includes('fear') || text.includes('strong') || text.includes('courage')) {
      categories['담대함 (Courage)'].push(verse);
    } else if (text.includes('peace') || text.includes('rest') || text.includes('anxious')) {
      categories['평안 (Peace)'].push(verse);
    } else if (text.includes('faith') || text.includes('believe') || text.includes('trust')) {
      categories['믿음 (Faith)'].push(verse);
    } else {
      categories['기타 (Others)'].push(verse);
    }
  });

  // 빈 카테고리 제거
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

const LibraryModule = ({ onStartPractice }) => {
  const [categories, setCategories] = useState({});
  const [expandedVerseId, setExpandedVerseId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const verses = getVerses();
    const categorized = categorizeVerses(verses);
    setCategories(categorized);
    setActiveCategory(Object.keys(categorized)[0]);
  }, []);

  const handleExpand = (id) => {
    setExpandedVerseId(expandedVerseId === id ? null : id);
    if (expandedVerseId !== id) {
      // 펼칠 때 마지막으로 읽은 구절로 저장
      setLastReadVerseId(id);
    } else {
      stopTTS();
    }
  };

  const handlePlayTTS = (e, text) => {
    e.stopPropagation(); // 카드 접힘 방지
    const settings = JSON.parse(localStorage.getItem('enbible_settings')) || { ttsRate: 1.0 };
    playTTS(text, settings.ttsRate);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFC]">
      {/* 카테고리 탭 */}
      <div className="flex overflow-x-auto gap-2 p-4 no-scrollbar border-b border-gray-100">
        {Object.keys(categories).map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setExpandedVerseId(null); stopTTS(); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 구절 리스트 */}
      <div className="p-4 flex-1 overflow-y-auto pb-20">
        {activeCategory && categories[activeCategory] && categories[activeCategory].map(verse => (
          <div key={verse.id} className="bg-white rounded-2xl shadow-sm mb-4 border border-gray-100 overflow-hidden transition-all">
            {/* 요약 헤더 (항상 보임) */}
            <div 
              className="p-5 cursor-pointer flex justify-between items-center hover:bg-gray-50"
              onClick={() => handleExpand(verse.id)}
            >
              <div>
                <h3 className="text-gray-800 font-bold">{verse.ref}</h3>
                <p className="text-gray-500 text-sm truncate max-w-[220px] mt-1">{verse.nivText}</p>
              </div>
              <div className={`transform transition-transform ${expandedVerseId === verse.id ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* 상세 3단 카드 (펼쳤을 때만 보임) */}
            {expandedVerseId === verse.id && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50">
                
                {/* 1. NIV 영어 + 스피커 */}
                <div className="mb-5 relative bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <button 
                    onClick={(e) => handlePlayTTS(e, verse.nivText)}
                    className="absolute top-3 right-3 bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
                    title="들어보기"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                  </button>
                  <p className="text-gray-900 text-lg font-medium pr-10 leading-relaxed">
                    🇺🇸 {verse.nivText}
                  </p>
                </div>

                {/* 2. 개역개정 한글 */}
                <div className="mb-5 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-700 text-md leading-relaxed">
                    🇰🇷 {verse.korText}
                  </p>
                </div>

                {/* 3. 영문법 포인트 */}
                <div className="mb-5 bg-[#F9FAFB] p-4 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    💡 3분 영문법 포인트
                  </h4>
                  <div className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                    {verse.grammarTips}
                  </div>
                </div>

                {/* 하단 암송 연습실 이동 버튼 */}
                <button 
                  onClick={() => onStartPractice(verse.id)}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                  이 구절 암송 연습실로 이동 →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryModule;

