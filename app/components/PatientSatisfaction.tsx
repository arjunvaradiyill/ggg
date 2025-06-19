import React from 'react';

const donutData = [
  { label: 'Excellent', value: 65, color: '#377DFF' },
  { label: 'Good', value: 25, color: '#19C37D' },
  { label: 'Poor', value: 10, color: '#FFA800' },
];

const total = 45251;
const satisfaction = 85;
const averageRating = 4.8;
const reviews = 2847;
const recommend = 98;

function getOffset(index: number) {
  const totalValue = donutData.reduce((sum, d) => sum + d.value, 0);
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += donutData[i].value;
  }
  return (offset / totalValue) * 100;
}

export default function PatientSatisfaction() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 bg-blue-100 inline-block px-2 rounded">Patient Satisfaction</h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg width="192" height="192" viewBox="0 0 192 192" className="rotate-90">
            {donutData.map((d, i) => {
              const totalValue = donutData.reduce((sum, d) => sum + d.value, 0);
              const dashArray = `${(d.value / totalValue) * 570} 570`;
              const dashOffset = (570 * getOffset(i)) / 100;
              return (
                <circle
                  key={d.label}
                  r="91"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth="18"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-dashOffset}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Background circle */}
            <circle r="91" cx="96" cy="96" fill="transparent" stroke="#F3F4F6" strokeWidth="18" />
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-gray-900 leading-none">{total.toLocaleString()}</span>
            <span className="text-lg font-semibold text-gray-500 -mt-1">Total</span>
            <span className="text-2xl font-bold text-gray-800 mt-1">{satisfaction}%</span>
            <span className="text-sm text-gray-500 -mt-1">Satisfaction</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-4">
          {donutData.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full" style={{ background: d.color }}></span>
              <span className="text-lg font-semibold text-gray-700">{d.label}</span>
              <span className="text-gray-500 text-base">({d.value}%)</span>
            </div>
          ))}
        </div>
      </div>
      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-600">{averageRating}</span>
          <span className="text-gray-500 font-medium mt-1">Average Rating</span>
        </div>
        <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-600">{reviews.toLocaleString()}</span>
          <span className="text-gray-500 font-medium mt-1">Reviews</span>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-orange-500">{recommend}%</span>
          <span className="text-gray-500 font-medium mt-1">Would Recommend</span>
        </div>
      </div>
    </div>
  );
} 