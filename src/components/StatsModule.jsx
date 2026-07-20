import React, { useState, useEffect } from 'react';
import { getAttendanceDates, getStreak, getMemorizedVerses } from '../services/storage';

const StatsModule = () => {
  const [dates, setDates] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalMemorized, setTotalMemorized] = useState(0);

  useEffect(() => {
    setDates(getAttendanceDates());
    setStreak(getStreak());
    setTotalMemorized(getMemorizedVerses().length);
  }, []);

  // 간단한 달력 생성 로직 (이번 달)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0(Sun) ~ 6(Sat)

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // 빈 칸
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isAttended = (day) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dates.includes(dateStr);
  };

  return (
    <div className="p-5 overflow-y-auto pb-20">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">나의 성장 기록</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-gray-500 mb-1">총 외운 구절</div>
          <div className="text-4xl font-black text-blue-600">{totalMemorized}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-white">
          <div className="text-sm font-bold mb-1 opacity-90">연속 암송일수</div>
          <div className="text-4xl font-black">{streak}일</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">{month + 1}월 출석부</h3>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <div key={d} className="text-xs font-bold text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium ${
                isAttended(day) 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : day 
                    ? 'bg-gray-50 text-gray-600' 
                    : ''
              }`}
            >
              {day || ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsModule;
