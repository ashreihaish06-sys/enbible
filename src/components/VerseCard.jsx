import React from 'react';

const VerseCard = ({ verse }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{verse.ref}</h3>
      <p className="text-gray-900 text-xl font-medium leading-relaxed mb-4">
        {verse.nivText}
      </p>
      <p className="text-gray-600 text-md leading-relaxed mb-4">
        {verse.korText}
      </p>
      
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Grammar Tips</h4>
        <div className="text-gray-700 text-sm whitespace-pre-line">
          {verse.grammarTips}
        </div>
      </div>
    </div>
  );
};

export default VerseCard;
