import React, { useState, useEffect } from 'react';
import { getStreak, getLastReadVerseId, recordAttendance } from '../services/storage';
import { getVerses, getVerseById } from '../services/verseService';

const HomeModule = ({ onStartPractice }) => {
  const [streak, setStreak] = useState(0);
  const [todayVerse, setTodayVerse] = useState(null);
  const [lastVerse, setLastVerse] = useState(null);

  useEffect(() => {
    // 앱 접속 시 출석 체크
    recordAttendance();
    
    // 연속 출석일수 불러오기
    setStreak(getStreak());

    // 모든 구절 가져오기
    const verses = getVerses();
    if (verses.length > 0) {
      // 오늘의 추천 구절 (간단히 랜덤으로 하나 선택, 혹은 날짜 기반 등)
      // 여기서는 날짜 기반으로 매일 바뀌게 구현 (예시)
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const index = dayOfYear % verses.length;
      setTodayVerse(verses[index]);
    }

    // 마지막으로 읽은 구절
    const lastId = getLastReadVerseId();
    if (lastId) {
      setLastVerse(getVerseById(lastId));
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto pb-20">
      {/* 상단: 불꽃 카드 */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-lg p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">🔥 연속 암송 중!</h2>
          <p className="text-white/90 text-sm">오늘도 잊지 않고 찾아오셨군요!</p>
        </div>
        <div className="text-4xl font-extrabold bg-white/20 px-4 py-2 rounded-xl">
          {streak}일
        </div>
      </div>

      {/* 중앙: 오늘의 추천 구절 카드 */}
      {todayVerse && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Today's Verse</span>
            <span className="text-sm font-semibold text-gray-500">{todayVerse.ref}</span>
          </div>
          <p className="text-gray-900 text-xl font-medium leading-relaxed mb-4">
            "{todayVerse.nivText}"
          </p>
          <p className="text-gray-600 text-md leading-relaxed mb-6">
            {todayVerse.korText}
          </p>
          <button 
            onClick={() => onStartPractice(todayVerse.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            바로 암송하기
          </button>
        </div>
      )}

      {/* 하단: 최근 구절 이어하기 */}
      {lastVerse && (
        <button 
          onClick={() => onStartPractice(lastVerse.id)}
          className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">최근 암송 구절 이어하기</h3>
            <p className="text-gray-800 font-semibold">{lastVerse.ref}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-full text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default HomeModule;
