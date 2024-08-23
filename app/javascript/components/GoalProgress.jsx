import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const GoalProgress = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100); // Slight delay to trigger the animation
  }, [progress]);

  return (
    <div className="relative group hover:cursor-pointer w-14 h-14">
      <CircularProgressbar
        value={animatedProgress}
        text={`${animatedProgress}%`}
        styles={buildStyles({
          textSize: '24px', // Set text size
          textColor: "#1F2937", // Tailwind's 'text-gray-700'
          pathColor: "#3B82F6", // Tailwind's 'text-sky-500'
          trailColor: "#D1D5DB", // Tailwind's 'bg-gray-300'
          strokeLinecap: 'round', // Rounded ends for the path
          pathTransitionDuration: 1, // Smooth transition duration
        })}
        /* Add these props to ensure proper text alignment */
        textProps={{
          x: '50',
          y: '50',
          textAnchor: 'middle',
          dominantBaseline: 'central',
        }}
      />
    </div>
  );
};

export default GoalProgress;
