"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface BindingTemplate {
  id: string;
  name: string;
  type: 'topPad' | 'sidePad' | 'sideBinding' | 'topBinding';
  imageUrl: string;
  description: string;
}

interface BindingTemplatesContextType {
  bindingTemplates: BindingTemplate[];
  addTemplate: (template: Omit<BindingTemplate, 'id'>) => void;
  removeTemplate: (id: string) => void;
  updateTemplate: (id: string, template: Partial<BindingTemplate>) => void;
  getTemplatesByType: (type: BindingTemplate['type']) => BindingTemplate[];
}

const BindingTemplatesContext = createContext<BindingTemplatesContextType | undefined>(undefined);

// Default templates with local file paths
const defaultTemplates: BindingTemplate[] = [
  // Side Pad Templates
  {
    id: 'side-pad-1',
    name: 'Side Pad Basic',
    type: 'sidePad',
    imageUrl: '/templates/binding/side-pad-basic.png',
    description: 'Basic side pad binding template'
  },
  // Side Binding Templates
  {
    id: 'side-binding-1',
    name: 'Side Binding Basic',
    type: 'sideBinding',
    imageUrl: '/templates/binding/side-binding-basic.png',
    description: 'Basic side binding template'
  },
  {
    id: 'side-binding-2ups',
    name: 'Side Binding 2 Ups',
    type: 'sideBinding',
    imageUrl: '/templates/binding/side-binding-02ups.png',
    description: 'Side binding template with 2 ups'
  },
  {
    id: 'side-binding-4ups',
    name: 'Side Binding 4 Ups',
    type: 'sideBinding',
    imageUrl: '/templates/binding/side-binding-04ups.png',
    description: 'Side binding template with 4 ups'
  },
  {
    id: 'side-binding-6ups',
    name: 'Side Binding 6 Ups',
    type: 'sideBinding',
    imageUrl: '/templates/binding/side-binding-06ups.png',
    description: 'Side binding template with 6 ups'
  },
  {
    id: 'side-binding-8ups',
    name: 'Side Binding 8 Ups',
    type: 'sideBinding',
    imageUrl: '/templates/binding/side-binding-08ups.png',
    description: 'Side binding template with 8 ups'
  },
  {
    id: 'side-binding-10ups',
    name: 'Side Binding 10 Ups',
    type: 'sideBinding',
    imageUrl: '/templates/binding/side-binding-10ups.png',
    description: 'Side binding template with 10 ups'
  },
  // Top Pad Templates
  {
    id: 'top-pad-1',
    name: 'Top Pad Basic',
    type: 'topPad',
    imageUrl: '/templates/binding/top-pad-basic.png',
    description: 'Basic top pad binding template'
  },
  // Top Binding Templates
  {
    id: 'top-binding-1',
    name: 'Top Binding Basic',
    type: 'topBinding',
    imageUrl: '/templates/binding/top-binding-basic.png',
    description: 'Basic top binding template'
  },
  {
    id: 'top-binding-2ups',
    name: 'Top Binding 2 Ups',
    type: 'topBinding',
    imageUrl: '/templates/binding/top-binding-02ups.png',
    description: 'Top binding template with 2 ups'
  },
  {
    id: 'top-binding-3ups',
    name: 'Top Binding 3 Ups',
    type: 'topBinding',
    imageUrl: '/templates/binding/top-binding-03ups.png',
    description: 'Top binding template with 3 ups'
  }
];

export function BindingTemplatesProvider({ children }: { children: React.ReactNode }) {
  const [bindingTemplates, setBindingTemplates] = useState<BindingTemplate[]>(() => {
    // Load templates from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedTemplates = localStorage.getItem('bindingTemplates');
      return savedTemplates ? JSON.parse(savedTemplates) : defaultTemplates;
    }
    return defaultTemplates;
  });

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bindingTemplates', JSON.stringify(bindingTemplates));
    }
  }, [bindingTemplates]);

  const addTemplate = (template: Omit<BindingTemplate, 'id'>) => {
    const newTemplate: BindingTemplate = {
      ...template,
      id: Date.now().toString()
    };
    setBindingTemplates(prev => [...prev, newTemplate]);
  };

  const removeTemplate = (id: string) => {
    setBindingTemplates(prev => prev.filter(template => template.id !== id));
  };

  const updateTemplate = (id: string, updates: Partial<BindingTemplate>) => {
    setBindingTemplates(prev =>
      prev.map(template =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const getTemplatesByType = (type: BindingTemplate['type']) => {
    return bindingTemplates.filter(template => template.type === type);
  };

  return (
    <BindingTemplatesContext.Provider
      value={{
        bindingTemplates,
        addTemplate,
        removeTemplate,
        updateTemplate,
        getTemplatesByType
      }}
    >
      {children}
    </BindingTemplatesContext.Provider>
  );
}

export function useBindingTemplates() {
  const context = useContext(BindingTemplatesContext);
  if (context === undefined) {
    throw new Error('useBindingTemplates must be used within a BindingTemplatesProvider');
  }
  return context;
} 