import React, { useEffect } from "react";
import { useState } from "react";

function Timer({ initialTime, timerState, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!timerState) return;
    setTimeLeft(initialTime);

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, timerState]);

  return (
    <div>
      <h1>Time left: {timeLeft} seconds</h1>
      {timeLeft === 0 && <p>Time Expired!</p>}
    </div>
  );
}

export default Timer;
