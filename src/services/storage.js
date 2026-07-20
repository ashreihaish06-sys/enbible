const STORAGE_KEYS = {
  MEMORIZED_VERSES: 'enbible_memorized_verses',
  LAST_READ_VERSE: 'enbible_last_read_verse',
  ATTENDANCE_DATES: 'enbible_attendance_dates',
  SETTINGS: 'enbible_settings',
};

// 암송 완료한 구절 ID 저장/조회
export const getMemorizedVerses = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MEMORIZED_VERSES);
  return data ? JSON.parse(data) : [];
};

export const addMemorizedVerse = (id) => {
  const verses = getMemorizedVerses();
  if (!verses.includes(id)) {
    verses.push(id);
    localStorage.setItem(STORAGE_KEYS.MEMORIZED_VERSES, JSON.stringify(verses));
  }
  return verses;
};

export const toggleMemorizedVerse = (id) => {
  const verses = getMemorizedVerses();
  const index = verses.indexOf(id);
  if (index >= 0) {
    verses.splice(index, 1);
  } else {
    verses.push(id);
  }
  localStorage.setItem(STORAGE_KEYS.MEMORIZED_VERSES, JSON.stringify(verses));
  return verses;
};

// 마지막으로 읽은 구절 ID 저장/조회
export const getLastReadVerseId = () => {
  const data = localStorage.getItem(STORAGE_KEYS.LAST_READ_VERSE);
  return data ? parseInt(data, 10) : null;
};

export const setLastReadVerseId = (id) => {
  localStorage.setItem(STORAGE_KEYS.LAST_READ_VERSE, id.toString());
};

// 출석 날짜 기록 및 연속 암송일수(Streak) 계산
export const getAttendanceDates = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_DATES);
  return data ? JSON.parse(data) : [];
};

export const recordAttendance = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const dates = getAttendanceDates();
  
  if (!dates.includes(today)) {
    dates.push(today);
    // 오름차순 정렬
    dates.sort();
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_DATES, JSON.stringify(dates));
  }
  return dates;
};

export const getStreak = () => {
  const dates = getAttendanceDates();
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const sortedDates = [...dates].sort().reverse();
  let expectedDate = new Date(today);

  if (sortedDates[0] === today.toISOString().split('T')[0]) {
    // Today is recorded
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (sortedDates[0] === yesterday.toISOString().split('T')[0]) {
      expectedDate = yesterday;
    } else {
      return 0;
    }
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const recordDateStr = sortedDates[i];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (recordDateStr === expectedDateStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// 환경설정 저장/조회
export const getSettings = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : { ttsRate: 1.0, textSize: 'normal' };
};

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
