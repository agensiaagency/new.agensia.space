const industryData = [
  { 
    name: 'Zahnarzt', 
    package: 'Professional', 
    features: { 
      Starter: [], 
      Professional: ['Terminbuchung', 'Patientenverwaltung'], 
      Premium: ['Terminbuchung', 'Patientenverwaltung', 'Online-Anamnese'] 
    } 
  },
  { 
    name: 'Coaching', 
    package: 'Starter', 
    features: { 
      Starter: ['Kontaktformular', 'Über mich Bereich'], 
      Professional: ['Kontaktformular', 'Über mich Bereich', 'Terminbuchung'], 
      Premium: ['Online-Kurse', 'Mitgliederbereich'] 
    } 
  },
  { 
    name: 'Architektur', 
    package: 'Premium', 
    features: { 
      Starter: ['Bildergalerie'], 
      Professional: ['Portfolio-Galerie', 'Projekt-Showcase'], 
      Premium: ['Portfolio-Galerie', 'Projekt-Showcase', 'Interaktive Pläne'] 
    } 
  },
  { 
    name: 'Physiotherapie', 
    package: 'Professional', 
    features: { 
      Starter: ['Kontaktformular'], 
      Professional: ['Terminbuchung', 'Leistungsübersicht'], 
      Premium: ['Terminbuchung', 'Leistungsübersicht', 'Online-Kurse'] 
    } 
  },
  { 
    name: 'Grafikdesign', 
    package: 'Starter', 
    features: { 
      Starter: ['Portfolio', 'Kontakt'], 
      Professional: ['Portfolio', 'Kontakt', 'Kundenportal'], 
      Premium: ['Portfolio', 'Shop für Assets'] 
    } 
  },
  { 
    name: 'E-Commerce', 
    package: 'Premium', 
    features: { 
      Starter: [], 
      Professional: ['Produktkatalog'], 
      Premium: ['Shop-Integration', 'Payment-Gateway', 'Warenkorb'] 
    } 
  },
  { 
    name: 'Beratung', 
    package: 'Professional', 
    features: { 
      Starter: ['Kontaktformular'], 
      Professional: ['Terminbuchung', 'Blog'], 
      Premium: ['Terminbuchung', 'Webinare', 'Kundenportal'] 
    } 
  },
  { 
    name: 'Fotografie', 
    package: 'Starter', 
    features: { 
      Starter: ['Bildergalerie', 'Kontakt'], 
      Professional: ['Kunden-Galerien', 'Terminbuchung'], 
      Premium: ['Shop für Prints', 'Kunden-Galerien'] 
    } 
  },
  { 
    name: 'Immobilien', 
    package: 'Premium', 
    features: { 
      Starter: ['Kontaktformular'], 
      Professional: ['Objekt-Listing'], 
      Premium: ['Objekt-Listing', 'Erweiterte Filter', 'Interaktive Karte'] 
    } 
  },
  { 
    name: 'Rechtsanwalt', 
    package: 'Professional', 
    features: { 
      Starter: ['Kontaktformular'], 
      Professional: ['Mandantenportal', 'Fachartikel'], 
      Premium: ['Mandantenportal', 'Online-Akte', 'Zahlungsabwicklung'] 
    } 
  }
];

export const getAllIndustries = () => industryData.map(i => i.name);

export const getRecommendedPackage = (industry) => {
  if (!industry) return null;
  const found = industryData.find(i => i.name.toLowerCase() === industry.toLowerCase());
  return found ? found.package : null;
};

export const getIndustryFeatures = (industry, packageType) => {
  if (!industry || !packageType) return [];
  const found = industryData.find(i => i.name.toLowerCase() === industry.toLowerCase());
  if (!found || !found.features[packageType]) return [];
  return found.features[packageType];
};