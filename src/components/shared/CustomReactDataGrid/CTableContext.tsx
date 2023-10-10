import React, { createContext, useContext, useRef } from 'react';

const CTableContext = createContext();

export const CTableProvider = ({ children }) => {
  const cTable = useRef(null);

  return (
    <CTableContext.Provider value={cTable}>
      {children}
    </CTableContext.Provider>
  );
};

// hook para acessar a cTable
export const useCTable = () => {
  return useContext(CTableContext);
};