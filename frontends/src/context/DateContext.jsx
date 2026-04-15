import React, { createContext, useContext, useState } from 'react';

const DateContext = createContext();

export function useDate() {
  return useContext(DateContext);
}

export function DateProvider({ children }) {
  // Store a string YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}
