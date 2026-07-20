import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getVerseById } from '../services/verseService';
import { addMemorizedVerse, recordAttendance } from '../services/storage';

const PracticeModule = ({ verseId }) => {
  const [verse, setVerse] = useState(null);
  const [stage, setStage] = useState(1);
  const [showKor, setShowKor] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);
  
  // Stage 1 State
  const [words, setWords] = useState([]);
  const [maskedIndices, setMaskedIndices] = useState([]);
  const [filledIndices, setFilledIndices] = useState([]);
  const [options, setOptions] = useState([]);

  // Stage 3 State
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (verseId) {
      const v = getVerseById(verseId);
      setVerse(v);
      initStage1(v.nivText);
      setStage(1);
      setShowKor(false);
      setShowGrammar(false);
      setShowAnswer(false);
    }
  }, [verseId]);

  const initStage1 = (text) => {
    const w = text.split(' ');
    setWords(w);
    
    // 3글자 이상인 단어 중 랜덤으로 최대 3개 선택하여 가리기
    const candidates = w.map((word, index) => ({ word, index })).filter(item => item.word.replace(/[^a-zA-Z]/g, '').length >= 3);
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, shuffled.length));
    
    const mIndices = selected.map(item => item.index);
    setMaskedIndices(mIndices);
    setFilledIndices([]);
    
    // 버튼용 옵션 (랜덤 섞기)
    const opts = selected.map(item => ({ index: item.index, text: item.word }));
    setOptions(opts.sort(() => 0.5 - Math.random()));
  };

  const handleOptionClick = (opt) => {
    // 가장 먼저 채워야 할 빈칸 찾기
    const nextEmptyIndex = maskedIndices.find(idx => !filledIndices.includes(idx));
    if (nextEmptyIndex === opt.index) {
      // 정답
      setFilledIndices([...filledIndices, opt.index]);
    } else {
      // 오답 (틀림 시각 효과는 생략하고 넘어감)
    }
  };

  const handleCompleteStage = () => {
    if (stage < 3) {
      setStage(stage + 1);
    } else {
      // 3단계 완료
      addMemorizedVerse(verseId);
      recordAttendance();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const renderStage1 = () => {
    const isComplete = maskedIndices.length > 0 && maskedIndices.every(idx => filledIndices.includes(idx));
    return (
      <div className="animate-fade-in">
        <p className="text-gray-900 text-xl font-medium leading-relaxed mb-8 flex flex-wrap gap-1">
          {words.map((word, idx) => {
            if (maskedIndices.includes(idx) && !filledIndices.includes(idx)) {
              return <span key={idx} className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>;
            }
            return <span key={idx}>{word}</span>;
          })}
        </p>
        
        {!isComplete && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {options.map(opt => (
              !filledIndices.includes(opt.index) && (
                <button 
                  key={opt.index}
                  onClick={() => handleOptionClick(opt)}
                  className="bg-white border-2 border-blue-600 text-blue-600 font-bold py-2 px-4 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  {opt.text}
                </button>
              )
            ))}
          </div>
        )}
        
        {isComplete && (
          <button onClick={handleCompleteStage} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl mt-4">
            2단계로 넘어가기 →
          </button>
        )}
      </div>
    );
  };

  const renderStage2 = () => {
    // 첫 글자만 남기고 숨기기 (알파벳만 언더바로 치환)
    const hintedText = verse.nivText.split(' ').map(word => {
      let firstAlphaFound = false;
      return word.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
          if (!firstAlphaFound) {
            firstAlphaFound = true;
            return char;
          }
          return '_';
        }
        return char; // 구두점은 그대로
      }).join('');
    }).join(' ');

    return (
      <div className="animate-fade-in">
        <p className="text-gray-900 text-2xl font-mono leading-relaxed mb-8 tracking-widest break-words">
          {hintedText}
        </p>
        <button onClick={handleCompleteStage} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl mt-4">
          3단계로 넘어가기 →
        </button>
      </div>
    );
  };

  const renderStage3 = () => {
    return (
      <div className="animate-fade-in text-center">
        {!showAnswer ? (
          <>
            <div className="bg-gray-100 rounded-2xl h-32 flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
              <span className="text-gray-400 font-bold">전체 가려짐. 소리 내어 외워보세요!</span>
            </div>
            <button onClick={() => setShowAnswer(true)} className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl mb-4 hover:bg-gray-50">
              정답 확인
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-900 text-xl font-medium leading-relaxed mb-6">
              {verse.nivText}
            </p>
            <button onClick={handleCompleteStage} className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90">
              🎉 완료 도장 쾅!
            </button>
          </>
        )}
      </div>
    );
  };

  if (!verse) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 font-medium">
        홈이나 서재에서 구절을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#FAFAFC] overflow-y-auto pb-20">
      
      {/* 진행 상태 바 */}
      <div className="flex gap-2 p-4 pt-6 bg-white border-b border-gray-100">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-2 rounded-full ${stage >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="p-5 flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-6">
          {stage === 1 && "1단계: 빈칸 채우기"}
          {stage === 2 && "2단계: 첫 글자 힌트"}
          {stage === 3 && "3단계: 완전 가리기"}
        </h2>

        {stage === 1 && renderStage1()}
        {stage === 2 && renderStage2()}
        {stage === 3 && renderStage3()}

        {/* 힌트 토글 버튼들 */}
        <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col gap-3">
          <button 
            onClick={() => setShowKor(!showKor)}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-gray-700 font-bold text-sm"
          >
            🇰🇷 한글 힌트 보기 {showKor ? '▼' : '▶'}
          </button>
          {showKor && (
            <div className="px-4 pb-2 text-gray-600 text-sm animate-fade-in">
              {verse.korText}
            </div>
          )}

          <button 
            onClick={() => setShowGrammar(!showGrammar)}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-gray-700 font-bold text-sm"
          >
            💡 영문법 힌트 보기 {showGrammar ? '▼' : '▶'}
          </button>
          {showGrammar && (
            <div className="px-4 pb-2 text-gray-600 text-sm whitespace-pre-line animate-fade-in">
              {verse.grammarTips}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeModule;
