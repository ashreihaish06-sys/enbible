import versesData from '../data/verses.json';

export const getVerses = () => {
  return versesData;
};

export const getVerseById = (id) => {
  return versesData.find((verse) => verse.id === id);
};
