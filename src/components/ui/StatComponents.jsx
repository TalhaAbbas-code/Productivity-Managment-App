import React, { useEffect, useState } from "react";

export const StatCard = ({ title, value, extra }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
    <h3 className="text-2xl text-gray-600 font-semibold">{title}</h3>
    <p className="text-5xl font-bold text-indigo-600">{value}</p>
    {extra && <div className="mt-10">{extra}</div>}
  </div>
);

export const AnimatedProgressBar = ({ label, value, total }) => {
  const [progress, setProgress] = useState(0);
  const percent = total > 0 ? (value / total) * 100 : 0;

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 10;
    const steps = duration / stepTime;
    const increment = percent / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= percent) {
        setProgress(percent);
        clearInterval(interval);
      } else {
        setProgress(start);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [percent]);

  return (
    <div>
      <p className="text-lg font-medium text-primarytext mb-1">
        {label} ({value}/{total})
      </p>
      <div className="w-full bg-gray-300 h-6 rounded-full overflow-hidden">
        <div
          className="h-6 bg-green-500 rounded-full transition-all duration-75 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
