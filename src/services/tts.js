export const isTTSAvailable = () => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export const stopTTS = () => {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 텍스트를 음성으로 읽어줍니다.
 * @param {string} text - 읽을 텍스트 (예: NIV 성경 구절)
 * @param {number} rate - 읽는 속도 (기본값: 1.0, 0.8: 느리게, 1.2: 빠르게)
 */
export const playTTS = (text, rate = 1.0) => {
  if (!isTTSAvailable()) {
    console.warn('이 브라우저는 Web Speech API를 지원하지 않습니다.');
    return;
  }

  // 이전에 재생 중이던 음성이 있다면 취소
  stopTTS();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // 영어로 설정 (NIV 성경을 위해 미국 영어 사용)
  utterance.lang = 'en-US';
  
  // 재생 속도 설정
  utterance.rate = rate;
  
  // 피치(높낮이) 설정 (기본값)
  utterance.pitch = 1.0;

  // 음성 재생 시작
  window.speechSynthesis.speak(utterance);
};
