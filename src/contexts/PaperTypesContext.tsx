"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PaperType {
  id: string;
  name: string;
}

interface PaperTypesContextType {
  paperTypes: PaperType[];
  addPaperType: (name: string) => void;
  removePaperType: (id: string) => void;
  updatePaperType: (id: string, name: string) => void;
}

const PaperTypesContext = createContext<PaperTypesContextType | undefined>(undefined);

export function PaperTypesProvider({ children }: { children: ReactNode }) {
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([]);

  const addPaperType = (name: string) => {
    setPaperTypes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: name.trim(),
      },
    ]);
  };

  const removePaperType = (id: string) => {
    setPaperTypes((prev) => prev.filter((type) => type.id !== id));
  };

  const updatePaperType = (id: string, name: string) => {
    setPaperTypes((prev) =>
      prev.map((type) => (type.id === id ? { ...type, name: name.trim() } : type))
    );
  };

  return (
    <PaperTypesContext.Provider
      value={{
        paperTypes,
        addPaperType,
        removePaperType,
        updatePaperType,
      }}
    >
      {children}
    </PaperTypesContext.Provider>
  );
}

export function usePaperTypes() {
  const context = useContext(PaperTypesContext);
  if (context === undefined) {
    throw new Error("usePaperTypes must be used within a PaperTypesProvider");
  }
  return context;
} 