import React, { createContext, useState, useEffect } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [lastTrackId, setLastTrackId] = useState(null);

  return (
    <TimerContext.Provider
      value={{
        isTimerActive,
        setIsTimerActive,
        timeLeft,
        setTimeLeft,
        lastTrackId,
        setLastTrackId,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
