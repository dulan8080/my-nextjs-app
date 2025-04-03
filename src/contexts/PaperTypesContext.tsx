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
  const [paperTypes, setPaperTypes] = useState<PaperType[]>([
    { id: "1", name: "Blank Paper" },
    { id: "2", name: "Art Paper" },
    { id: "3", name: "Dimy Paper" },
    { id: "4", name: "Poster Paper" },
    { id: "5", name: "Box Board" },
    { id: "6", name: "Art Board" },
    { id: "7", name: "Ivory Board" }
  ]);

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