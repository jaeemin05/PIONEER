'use client';

import { createContext, useContext, useState } from 'react';

const SessionModalContext = createContext(null);

export function SessionModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SessionModalContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </SessionModalContext.Provider>
  );
}

export function useSessionModal() {
  return useContext(SessionModalContext);
}
