
import React, { createContext, useContext, useState } from 'react';
import { categories } from '@/lib/categories';

const IntakeContext = createContext(null);

const customCategory = {
  id: 'custom',
  title: 'Custom Projekt',
  description: 'Maßgeschneiderte Lösung',
  color: '#888888',
  step2: { chipGroups: [], textareaLabel: 'Beschreibe dein Projekt im Detail' },
  step3: { styles: [], atmosphere: [] },
  step4: { goalLabel: 'Hauptziel', goals: ['Online Präsenz', 'Verkauf', 'Leads', 'Portfolio'], contentLabel: 'Inhalte', contents: [], selects: [] },
  step5: { assets: ['Fotos', 'Logo', 'Texte', 'Domain', 'Website', 'Neustart'] }
};

export const IntakeProvider = ({ children }) => {
  const [categoryId, setCategoryId] = useState(null);

  const [formData, setFormData] = useState({
    step1: { title: '', name: '', email: '', companyName: '', role: '', location: '', description: '', phone: '' },
    step2: { chips1: [], chips2: [], chips3: [], chips4: [], textarea: '' },
    step3: { styleId: '', atmosphere: [], inspiration: '' },
    step4: { goal: '', contents: [], select1: '', select2: '' },
    step5: { assets: [], timeline: '', budget: '', wishes: '', dsgvo: false, notes: '' }
  });

  const category = categories.find(c => c.id === categoryId) || (categoryId === 'custom' ? customCategory : null);

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  return (
    <IntakeContext.Provider value={{ categoryId, setCategoryId, category, formData, updateFormData }}>
      {children}
    </IntakeContext.Provider>
  );
};

export const useIntake = () => useContext(IntakeContext);
