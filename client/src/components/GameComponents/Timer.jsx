import React, { useEffect } from "react";
import { useState } from "react";
import { ProgressBar } from "react-bootstrap";

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
      {timeLeft > 0 && <h1>Time left: {timeLeft} seconds</h1>}
      <ProgressBar
        variant={
          timerState !== false
            ? timeLeft <= 5
              ? "danger"
              : "success"
            : "secondary"
        }
        animated
        now={(timeLeft / initialTime) * 100}
      />
      {timeLeft === 0 && <h1>Time Expired!</h1>}
    </div>
  );
}

export default Timer;
