import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/storage';

const SettingsModule = () => {
  const [settings, setSettings] = useState({ ttsRate: 1.0, textSize: 'normal' });

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="p-5 h-full bg-[#FAFAFC]">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">설정</h2>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-4">음성 듣기 (TTS) 속도</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">느리게</span>
          <input 
            type="range" 
            min="0.7" 
            max="1.2" 
            step="0.1" 
            value={settings.ttsRate} 
            onChange={(e) => updateSetting('ttsRate', parseFloat(e.target.value))}
            className="flex-1 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-500">빠르게</span>
        </div>
        <div className="text-center mt-2 text-blue-600 font-bold">{settings.ttsRate}x</div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">글자 크기</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => updateSetting('textSize', 'normal')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              settings.textSize === 'normal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            보통
          </button>
          <button 
            onClick={() => updateSetting('textSize', 'large')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              settings.textSize === 'large' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            크게
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
