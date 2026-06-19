// src/context/AIContext.jsx
import { createContext, useContext, useState } from 'react';

const AIContext = createContext(null);

export function AIProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <AIContext.Provider value={{ open, setOpen }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
