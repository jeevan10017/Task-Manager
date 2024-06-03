
import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = ({ dueDateTime, onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(dueDateTime));
  const timerRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (dueDateTime instanceof Date && !isNaN(dueDateTime)) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const timeRemaining = calculateTimeLeft(dueDateTime);
        if (timeRemaining.total <= 0) {
          clearInterval(timerRef.current);
          setIsCompleted(true);
          if (onTimeOut) {
            onTimeOut();
          }
        } else {
          setTimeLeft(timeRemaining);
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [dueDateTime, onTimeOut]);

  function calculateTimeLeft(dueDateTime) {
    const difference = new Date(dueDateTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };
    }

    return timeLeft;
  }

  return (
    <div className="timer">
      {isCompleted ? (
        <span>Task is overdue</span>
      ) : (
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      )}
    </div>
  );
};

export default Timer;
