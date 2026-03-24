export const colorGroups = {
  green: '#3d6145',
  red: '#9b2020',
  violet: '#7040a0',
  yellow: '#b8960c',
  blue: '#2a6db5'
};

const defaultAssets = ['Fotos', 'Logo', 'Texte', 'Domain', 'Instagram', 'Website', 'Neustart'];

export const categories = [
  // GREEN GROUP
  {
    id: 'bildende-kunst',
    title: 'Bildende Kunst',
    description: 'Für Maler, Bildhauer, Illustratoren und freie Künstler.',
    color: colorGroups.green,
    step2: {
      chipGroups: [
        { label: 'Medium', key: 'chips1', options: ['Malerei', 'Skulptur', 'Illustration', 'Fotografie', 'Digitale Kunst', 'Mixed Media'] },
        { label: 'Kontext', key: 'chips2', options: ['Galerie', 'Ausstellung', 'Verkauf', 'Portfolio', 'Auftragsarbeiten'] }
      ],
      textareaLabel: 'Stilbeschreibung'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Organisch & Geerdet', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's2', name: 'Editorial & Kühl', gradient: 'linear-gradient(135deg, #f0f2f5, #d1d5db)' },
        { id: 's3', name: 'Bold & Expressiv', gradient: 'linear-gradient(135deg, #ff4b4b, #900000)' },
        { id: 's4', name: 'Minimalistisch', gradient: 'linear-gradient(135deg, #ffffff, #f3f4f6)' }
      ],
      atmosphere: ['Ruhig', 'Dynamisch', 'Elegant', 'Provokant', 'Zeitlos', 'Modern']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Portfolio zeigen', 'Werke verkaufen', 'Galerien ansprechen', 'Aufträge generieren'],
      contentLabel: 'Inhalte',
      contents: ['Galerie', 'Über mich', 'Ausstellungen', 'Shop', 'Kontakt', 'Presse'],
      selects: [
        { label: 'Werke-Anzahl', key: 'select1', options: ['1-10', '11-30', '31-50', '50+'] }
      ]
    },
    step5: { assets: ['Werkfotos', 'Signatur/Logo', 'Künstlertext', 'CV', 'Domain', 'Instagram', 'Website', 'Neustart'] }
  },
  {
    id: 'grafikdesign',
    title: 'Grafikdesign',
    description: 'Für Designer, Art Direktoren und Kreativstudios.',
    color: colorGroups.green,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Branding', 'Webdesign', 'Print', 'UI/UX', 'Packaging', 'Motion'] },
        { label: 'Zielkunden', key: 'chips2', options: ['Startups', 'Mittelstand', 'Kultur', 'Corporate', 'Agenturen'] }
      ],
      textareaLabel: 'Designprozess'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Clean & Swiss', gradient: 'linear-gradient(135deg, #ffffff, #e5e5e5)' },
        { id: 's2', name: 'Playful & Pop', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
        { id: 's3', name: 'Dark & Edgy', gradient: 'linear-gradient(135deg, #2d3436, #000000)' },
        { id: 's4', name: 'Brutalist', gradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)' }
      ],
      atmosphere: ['Professionell', 'Kreativ', 'Laut', 'Strukturiert', 'Innovativ']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Kunden gewinnen', 'Portfolio präsentieren', 'Agentur-Bewerbung', 'Expertenstatus'],
      contentLabel: 'Inhalte',
      contents: ['Cases', 'Services', 'About', 'Blog', 'Kontakt'],
      selects: [
        { label: 'Präsentation', key: 'select1', options: ['Große Bilder', 'Detaillierte Case Studies', 'Video-Fokus', 'Minimalistisch'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'handwerk',
    title: 'Handwerk',
    description: 'Für Manufakturen, Tischler, Keramiker und Macher.',
    color: colorGroups.green,
    step2: {
      chipGroups: [
        { label: 'Handwerk', key: 'chips1', options: ['Holz', 'Metall', 'Keramik', 'Textil', 'Schmuck', 'Leder'] },
        { label: 'Angebot', key: 'chips2', options: ['Unikate', 'Kleinserie', 'Maßanfertigung', 'Reparatur', 'Kurse'] }
      ],
      textareaLabel: 'Zielgruppe'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Rustikal & Warm', gradient: 'linear-gradient(135deg, #d4a373, #8b5a2b)' },
        { id: 's2', name: 'Modern Craft', gradient: 'linear-gradient(135deg, #e9ecef, #9ca3af)' },
        { id: 's3', name: 'Premium & Dunkel', gradient: 'linear-gradient(135deg, #4b5563, #1f2937)' },
        { id: 's4', name: 'Hell & Natürlich', gradient: 'linear-gradient(135deg, #fdfbf7, #e2e8f0)' }
      ],
      atmosphere: ['Authentisch', 'Hochwertig', 'Traditionell', 'Modern', 'Nahbar']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Produkte verkaufen', 'Anfragen generieren', 'Marke aufbauen', 'Lokal gefunden werden'],
      contentLabel: 'Inhalte',
      contents: ['Produkte', 'Werkstatt', 'Philosophie', 'Kontakt', 'FAQ'],
      selects: [
        { label: 'Preis', key: 'select1', options: ['Premium/High-End', 'Mittelklasse', 'Einstieg', 'Auf Anfrage'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'floristik',
    title: 'Floristik',
    description: 'Für Floral Designer, Blumenstudios und Event-Floristik.',
    color: colorGroups.green,
    step2: {
      chipGroups: [
        { label: 'Angebot', key: 'chips1', options: ['Hochzeiten', 'Events', 'Abo', 'Trockenblumen', 'Workshops', 'Trauerfloristik'] },
        { label: 'Stil', key: 'chips2', options: ['Wild & Fine', 'Klassisch', 'Avantgarde', 'Minimalistisch', 'Bunt'] }
      ],
      textareaLabel: 'Zielgruppe'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Romantic & Soft', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's2', name: 'Dark & Moody', gradient: 'linear-gradient(135deg, #434343, #000000)' },
        { id: 's3', name: 'Vibrant & Fresh', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
        { id: 's4', name: 'Earthy & Natural', gradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)' }
      ],
      atmosphere: ['Romantisch', 'Wild', 'Elegant', 'Natürlich', 'Künstlerisch']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Hochzeitsanfragen', 'Event-Buchungen', 'Shop-Verkäufe', 'Portfolio zeigen'],
      contentLabel: 'Inhalte',
      contents: ['Galerie', 'Leistungen', 'Über uns', 'Kontakt', 'Shop'],
      selects: [
        { label: 'Volumen', key: 'select1', options: ['Exklusive Einzelaufträge', 'Regelmäßige Events', 'Tagesgeschäft', 'Mischung'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'nachhaltige-brand',
    title: 'Nachhaltige Brand',
    description: 'Für Eco-Labels, Fair Fashion und grüne Startups.',
    color: colorGroups.green,
    step2: {
      chipGroups: [
        { label: 'Produkt', key: 'chips1', options: ['Fashion', 'Kosmetik', 'Food', 'Home', 'Lifestyle', 'Dienstleistung'] },
        { label: 'Werte', key: 'chips2', options: ['Vegan', 'Fair Trade', 'Zero Waste', 'Lokal', 'Handmade', 'Recycled'] }
      ],
      textareaLabel: 'Zielgruppe'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Eco Minimal', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's2', name: 'Earthy & Warm', gradient: 'linear-gradient(135deg, #e6dada, #274046)' },
        { id: 's3', name: 'Bold Activist', gradient: 'linear-gradient(135deg, #f83600, #f9d423)' },
        { id: 's4', name: 'Clean & Tech', gradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)' }
      ],
      atmosphere: ['Transparent', 'Aktivistisch', 'Sanft', 'Modern', 'Bewusst']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Produkte verkaufen', 'Mission kommunizieren', 'Community aufbauen', 'B2B Partner finden'],
      contentLabel: 'Inhalte',
      contents: ['Shop', 'Mission/Werte', 'Materialien', 'Team', 'Blog/Magazin'],
      selects: [
        { label: 'Preis', key: 'select1', options: ['Premium', 'Mittelklasse', 'Zugänglich', 'Spendenbasiert'] }
      ]
    },
    step5: { assets: defaultAssets }
  },

  // RED GROUP
  {
    id: 'physiotherapie',
    title: 'Physiotherapie',
    description: 'Für Praxen, Osteopathen und Reha-Zentren.',
    color: colorGroups.red,
    step2: {
      chipGroups: [
        { label: 'Schwerpunkte', key: 'chips1', options: ['Orthopädie', 'Neurologie', 'Sportphysio', 'Manuelle Therapie', 'Kinder', 'Prävention'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Sportler', 'Senioren', 'Schmerzpatienten', 'Kinder', 'Büroangestellte'] }
      ],
      textareaLabel: 'Behandlung'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Klinisch & Clean', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's2', name: 'Warm & Vertrauensvoll', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
        { id: 's3', name: 'Sportlich & Dynamisch', gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' },
        { id: 's4', name: 'Ganzheitlich & Natur', gradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)' }
      ],
      atmosphere: ['Professionell', 'Empathisch', 'Aktivierend', 'Beruhigend', 'Modern']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Terminbuchungen', 'Patienteninfo', 'Mitarbeitergewinnung', 'Expertenstatus'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Team', 'Praxis', 'Kontakt/Anfahrt', 'Online-Termine'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Alle Kassen', 'Nur Privat', 'Selbstzahler', 'Mischung'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'personal-training',
    title: 'Personal Training',
    description: 'Für Fitness-Coaches, Yoga-Lehrer und Athletiktrainer.',
    color: colorGroups.red,
    step2: {
      chipGroups: [
        { label: 'Training', key: 'chips1', options: ['Kraft', 'Ausdauer', 'Yoga/Pilates', 'Mobility', 'Gewichtsverlust', 'Reha'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Anfänger', 'Athleten', 'Manager', 'Frauen', 'Senioren'] }
      ],
      textareaLabel: 'Ort'
    },
    step3: {
      styles: [
        { id: 's1', name: 'High Energy & Dark', gradient: 'linear-gradient(135deg, #434343, #000000)' },
        { id: 's2', name: 'Clean & Premium', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's3', name: 'Mindful & Soft', gradient: 'linear-gradient(135deg, #e6dada, #274046)' },
        { id: 's4', name: 'Bold & Neon', gradient: 'linear-gradient(135deg, #00c6ff, #0072ff)' }
      ],
      atmosphere: ['Motivierend', 'Exklusiv', 'Fordernd', 'Ganzheitlich', 'Nahbar']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Probetrainings', 'Online-Coaching', 'Abo-Verkäufe', 'Community'],
      contentLabel: 'Inhalte',
      contents: ['Angebote', 'Über mich', 'Erfolge/Testimonials', 'Preise', 'Kontakt'],
      selects: [
        { label: 'Preis', key: 'select1', options: ['Premium/High-Ticket', 'Mittelklasse', 'Gruppen-Tarife', 'Online-Abos'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'ernaehrung',
    title: 'Ernährung',
    description: 'Für Ernährungsberater, Diätassistenten und Health Coaches.',
    color: colorGroups.red,
    step2: {
      chipGroups: [
        { label: 'Schwerpunkte', key: 'chips1', options: ['Gewichtsmanagement', 'Sport', 'Vegan/Vegetarisch', 'Unverträglichkeiten', 'Darmgesundheit', 'Hormone'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Frauen', 'Sportler', 'Familien', 'Berufstätige', 'Kranke'] }
      ],
      textareaLabel: 'Qualifikation'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Fresh & Light', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's2', name: 'Earthy & Organic', gradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)' },
        { id: 's3', name: 'Clinical & Trust', gradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)' },
        { id: 's4', name: 'Vibrant & Colorful', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }
      ],
      atmosphere: ['Wissenschaftlich', 'Ganzheitlich', 'Motivierend', 'Verständnisvoll', 'Frisch']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Beratungen buchen', 'Online-Kurse verkaufen', 'Newsletter-Aufbau', 'Expertenstatus'],
      contentLabel: 'Inhalte',
      contents: ['Beratung', 'Über mich', 'Rezepte/Blog', 'Preise', 'Kontakt'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Krankenkassen-Zuschuss', 'Selbstzahler', 'Beides'] }
      ]
    },
    step5: { assets: defaultAssets }
  },

  // VIOLET GROUP
  {
    id: 'psychotherapie',
    title: 'Psychotherapie',
    description: 'Für psychologische Psychotherapeuten und Heilpraktiker.',
    color: colorGroups.violet,
    step2: {
      chipGroups: [
        { label: 'Methode', key: 'chips1', options: ['Verhaltenstherapie', 'Tiefenpsychologie', 'Psychoanalyse', 'Systemisch', 'Gestalttherapie', 'EMDR'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Erwachsene', 'Kinder/Jugendliche', 'Paare', 'Familien', 'Gruppen'] }
      ],
      textareaLabel: 'Schwerpunkte & Setting'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Ruhig & Sicher', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's2', name: 'Warm & Geborgen', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
        { id: 's3', name: 'Klar & Strukturiert', gradient: 'linear-gradient(135deg, #e9ecef, #9ca3af)' },
        { id: 's4', name: 'Naturverbunden', gradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)' }
      ],
      atmosphere: ['Vertrauensvoll', 'Professionell', 'Empathisch', 'Klar', 'Schützend']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Patienten informieren', 'Warteliste managen', 'Erstgespräche', 'Kollegen-Netzwerk'],
      contentLabel: 'Inhalte',
      contents: ['Therapieangebot', 'Zur Person', 'Ablauf/Kosten', 'Kontakt', 'Notfallnummern'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Gesetzlich', 'Privat', 'Selbstzahler', 'Alle'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'psychiatrie',
    title: 'Psychiatrie',
    description: 'Für Fachärzte für Psychiatrie und Psychotherapie.',
    color: colorGroups.violet,
    step2: {
      chipGroups: [
        { label: 'Fachrichtung', key: 'chips1', options: ['Allgemeinpsychiatrie', 'Kinder/Jugend', 'Gerontopsychiatrie', 'Suchtmedizin', 'Forensik'] },
        { label: 'Schwerpunkte', key: 'chips2', options: ['Depression', 'Angst', 'ADHS', 'Psychosen', 'Trauma', 'Burnout'] }
      ],
      textareaLabel: 'Zielgruppe & Leistungen'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Medizinisch & Modern', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's2', name: 'Seriös & Diskret', gradient: 'linear-gradient(135deg, #4b5563, #1f2937)' },
        { id: 's3', name: 'Hell & Freundlich', gradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)' },
        { id: 's4', name: 'Klassisch & Vertraut', gradient: 'linear-gradient(135deg, #e6dada, #274046)' }
      ],
      atmosphere: ['Kompetent', 'Diskret', 'Wissenschaftlich', 'Menschlich', 'Sicher']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Praxispräsenz', 'Patientenaufnahme', 'Rezeptbestellung online', 'Info-Portal'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Team/Praxis', 'Sprechzeiten', 'Kontakt', 'Aktuelles'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Alle Kassen', 'Privatpraxis'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'hypnose',
    title: 'Hypnose',
    description: 'Für Hypnosetherapeuten und Hypnose-Coaches.',
    color: colorGroups.violet,
    step2: {
      chipGroups: [
        { label: 'Methode', key: 'chips1', options: ['Klinische Hypnose', 'Sporthypnose', 'Rückführung', 'Erickson', 'Yager-Code'] },
        { label: 'Themen', key: 'chips2', options: ['Rauchentwöhnung', 'Gewicht', 'Ängste', 'Schlaf', 'Selbstbewusstsein', 'Schmerz'] }
      ],
      textareaLabel: 'Zielgruppe'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Mystisch & Tief', gradient: 'linear-gradient(135deg, #30cfd0, #330867)' },
        { id: 's2', name: 'Klar & Lösungsorientiert', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's3', name: 'Sanft & Fließend', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
        { id: 's4', name: 'Natur & Balance', gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)' }
      ],
      atmosphere: ['Tiefgründig', 'Befreiend', 'Seriös', 'Entspannend', 'Fokussiert']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Terminbuchungen', 'Aufklärung/Vertrauen', 'Online-Sitzungen', 'Audio-Verkauf'],
      contentLabel: 'Inhalte',
      contents: ['Anwendungsgebiete', 'Über Hypnose', 'Zur Person', 'Preise', 'Kontakt'],
      selects: [
        { label: 'Preis', key: 'select1', options: ['Paketpreise', 'Stundensatz', 'Auf Anfrage'] }
      ]
    },
    step5: { assets: defaultAssets }
  },
  {
    id: 'coaching',
    title: 'Coaching',
    description: 'Für Life-, Business- und Mindset-Coaches.',
    color: colorGroups.violet,
    step2: {
      chipGroups: [
        { label: 'Methode', key: 'chips1', options: ['Systemisch', 'NLP', 'Mindset', 'Karriere', 'Führungskräfte', 'Spiritual'] },
        { label: 'Themen', key: 'chips2', options: ['Berufung', 'Beziehungen', 'Stress', 'Potenzial', 'Konflikte', 'Gründung'] }
      ],
      textareaLabel: 'Zielgruppe'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Premium Business', gradient: 'linear-gradient(135deg, #2d3436, #000000)' },
        { id: 's2', name: 'Warm & Inspiring', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
        { id: 's3', name: 'Klar & Direkt', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's4', name: 'Spiritual & Deep', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' }
      ],
      atmosphere: ['Ermutigend', 'Professionell', 'Visionär', 'Strukturiert', 'Tiefgehend']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Kennenlerngespräche', 'Programm-Verkauf', 'Newsletter', 'Speaker-Anfragen'],
      contentLabel: 'Inhalte',
      contents: ['Programme', 'Über mich', 'Testimonials', 'Podcast/Blog', 'Kontakt'],
      selects: [
        { label: 'Arbeitsweise', key: 'select1', options: ['1:1 Coaching', 'Gruppenprogramme', 'Online-Kurse', 'Hybrid'] }
      ]
    },
    step5: { assets: defaultAssets }
  },

  // YELLOW GROUP (Premium & Business)
  {
    id: 'architektur',
    title: 'Architektur',
    description: 'Für Architekturbüros, Innenarchitekten und Planer.',
    color: colorGroups.yellow,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Wohnbau', 'Gewerbe', 'Innenarchitektur', 'Sanierung', 'Städtebau', 'Wettbewerbe'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Privatpersonen', 'Investoren', 'Öffentliche Hand', 'Unternehmen'] },
        { label: 'Stil', key: 'chips3', options: ['Modern', 'Klassisch', 'Nachhaltig', 'Minimalistisch', 'Brutalistisch'] }
      ],
      textareaLabel: 'Designphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Minimal & Architektonisch', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's2', name: 'Warm & Material', gradient: 'linear-gradient(135deg, #d4a373, #8b5a2b)' },
        { id: 's3', name: 'Editorial & Bold', gradient: 'linear-gradient(135deg, #2d3436, #000000)' },
        { id: 's4', name: 'Luxus & Elegant', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' }
      ],
      atmosphere: ['Strukturiert', 'Visionär', 'Zeitlos', 'Innovativ', 'Exklusiv']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Portfolio zeigen', 'Aufträge', 'Wettbewerbe', 'Brand', 'Investoren', 'Awards'],
      contentLabel: 'Inhalte',
      contents: ['Projekte', 'Büro/Team', 'Philosophie', 'Karriere', 'Kontakt', 'Presse'],
      selects: [
        { label: 'Projektanzahl', key: 'select1', options: ['1-5', '6-15', '16-30', '30+'] },
        { label: 'Projektdarstellung', key: 'select2', options: ['Große Bilder', 'Detaillierte Pläne', 'Mischung'] }
      ]
    },
    step5: { assets: ['Projektfotos', 'Pläne/Zeichnungen', 'Logo', 'Team-Portraits', 'Texte/Philosophie', 'Domain', 'Website', 'Neustart'] }
  },
  {
    id: 'immobilien',
    title: 'Immobilien',
    description: 'Für Makler, Projektentwickler und Hausverwaltungen.',
    color: colorGroups.yellow,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Verkauf', 'Vermietung', 'Projektentwicklung', 'Verwaltung', 'Wertermittlung'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Käufer', 'Verkäufer', 'Mieter', 'Investoren', 'Gewerbe'] },
        { label: 'Markt', key: 'chips3', options: ['Luxus', 'Wohnen', 'Gewerbe', 'Neubau', 'Bestand'] }
      ],
      textareaLabel: 'USP / Besonderheit'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Premium & Diskret', gradient: 'linear-gradient(135deg, #4b5563, #1f2937)' },
        { id: 's2', name: 'Modern & Hell', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's3', name: 'Klassisch & Seriös', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's4', name: 'Urban & Dynamisch', gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' }
      ],
      atmosphere: ['Vertrauensvoll', 'Exklusiv', 'Nahbar', 'Professionell', 'Lokal']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Objekte vermarkten', 'Eigentümer gewinnen', 'Markenaufbau', 'Mitarbeiter finden'],
      contentLabel: 'Inhalte',
      contents: ['Immobilien', 'Leistungen', 'Über uns', 'Referenzen', 'Kontakt'],
      selects: [
        { label: 'Objektanzahl', key: 'select1', options: ['1-10', '11-50', '50+'] }
      ]
    },
    step5: { assets: ['Objektfotos', 'Exposé-Material', 'Logo', 'Team-Portraits', 'Texte', 'Domain', 'Immobilienscout', 'Website', 'Neustart'] }
  },
  {
    id: 'rechtsanwaelte',
    title: 'Rechtsanwälte',
    description: 'Für Kanzleien, Notare und Fachanwälte.',
    color: colorGroups.yellow,
    step2: {
      chipGroups: [
        { label: 'Rechtsgebiet', key: 'chips1', options: ['Arbeitsrecht', 'Familienrecht', 'Wirtschaftsrecht', 'Strafrecht', 'Immobilienrecht', 'IT-Recht'] },
        { label: 'Mandanten', key: 'chips2', options: ['Privatpersonen', 'Unternehmen', 'Startups', 'Öffentliche Hand'] },
        { label: 'Kanzlei', key: 'chips3', options: ['Einzelkanzlei', 'Boutique', 'Mittelstand', 'Großkanzlei'] }
      ],
      textareaLabel: 'Kanzleiprofil'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Klassisch & Seriös', gradient: 'linear-gradient(135deg, #2d3436, #000000)' },
        { id: 's2', name: 'Modern & Zugänglich', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's3', name: 'Premium & Diskret', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's4', name: 'Klar & Strukturiert', gradient: 'linear-gradient(135deg, #e9ecef, #9ca3af)' }
      ],
      atmosphere: ['Kompetent', 'Durchsetzungsstark', 'Empathisch', 'Diskret', 'Modern']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Mandanten gewinnen', 'Expertenstatus', 'Recruiting', 'Kanzleipräsentation'],
      contentLabel: 'Inhalte',
      contents: ['Rechtsgebiete', 'Anwälte', 'Karriere', 'Aktuelles/Blog', 'Kontakt'],
      selects: [
        { label: 'Fokus', key: 'select1', options: ['Beratung', 'Prozessführung', 'Beides'] }
      ]
    },
    step5: { assets: ['Portrait/Kanzleifotos', 'Logo', 'Texte/Rechtsgebiete', 'Fachjournale', 'Domain', 'Website', 'Neustart'] }
  },
  {
    id: 'finanzberatung',
    title: 'Finanzberatung',
    description: 'Für Vermögensberater, Finanzplaner und Versicherungen.',
    color: colorGroups.yellow,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Vermögensaufbau', 'Altersvorsorge', 'Immobilienfinanzierung', 'Versicherungen', 'Unternehmensberatung'] },
        { label: 'Zielgruppe', key: 'chips2', options: ['Privatkunden', 'Unternehmer', 'Ärzte/Freiberufler', 'Familien'] },
        { label: 'Regulierung', key: 'chips3', options: ['Unabhängig', 'Gebunden', 'Honorarberatung'] }
      ],
      textareaLabel: 'Beratungsphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Vertrauensvoll & Warm', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's2', name: 'Modern & Digital', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's3', name: 'Premium & Exklusiv', gradient: 'linear-gradient(135deg, #2d3436, #000000)' },
        { id: 's4', name: 'Klar & Transparent', gradient: 'linear-gradient(135deg, #e9ecef, #9ca3af)' }
      ],
      atmosphere: ['Seriös', 'Unabhängig', 'Verständlich', 'Exklusiv', 'Zukunftsorientiert']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Leads generieren', 'Vertrauen aufbauen', 'Terminbuchungen', 'Kundenportal'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Über mich/Team', 'Kundenstimmen', 'Kontakt', 'Blog'],
      selects: [
        { label: 'Beratungsart', key: 'select1', options: ['Vor Ort', 'Online', 'Hybrid'] }
      ]
    },
    step5: { assets: ['Portrait/Bürofotos', 'Logo', 'Texte/Anlagekonzept', 'Zulassungen', 'Domain', 'Website', 'Neustart'] }
  },
  {
    id: 'gastronomie',
    title: 'Gastronomie',
    description: 'Für Restaurants, Cafés, Bars und Catering.',
    color: colorGroups.yellow,
    step2: {
      chipGroups: [
        { label: 'Konzept', key: 'chips1', options: ['Fine Dining', 'Casual', 'Café', 'Bar', 'Catering', 'Streetfood'] },
        { label: 'Küche', key: 'chips2', options: ['Regional', 'International', 'Vegan/Vegetarisch', 'Fusionsküche', 'Saisonal'] },
        { label: 'Zielgruppe', key: 'chips3', options: ['Feinschmecker', 'Familien', 'Business', 'Studenten', 'Touristen'] }
      ],
      textareaLabel: 'Story / Konzept'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Warm & Gemütlich', gradient: 'linear-gradient(135deg, #d4a373, #8b5a2b)' },
        { id: 's2', name: 'Dark & Moody', gradient: 'linear-gradient(135deg, #434343, #000000)' },
        { id: 's3', name: 'Frisch & Hell', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's4', name: 'Urban & Trendy', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }
      ],
      atmosphere: ['Einladend', 'Exklusiv', 'Lebhaft', 'Authentisch', 'Modern']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Tischreservierungen', 'Speisekarte zeigen', 'Events/Catering', 'Gutscheine verkaufen'],
      contentLabel: 'Inhalte',
      contents: ['Menü', 'Reservierung', 'Über uns', 'Galerie', 'Kontakt/Anfahrt'],
      selects: [
        { label: 'Reservierungssystem', key: 'select1', options: ['OpenTable', 'TheFork', 'Eigenes System', 'Telefonisch'] }
      ]
    },
    step5: { assets: ['Food-Fotografie', 'Interior-Fotos', 'Logo', 'Menükarte', 'Texte/Story', 'Domain', 'Social Media', 'Website', 'Neustart'] }
  },

  // BLUE GROUP (Medizin & Ärzte)
  {
    id: 'allgemeinmedizin',
    title: 'Allgemeinmedizin',
    description: 'Für Hausärzte, Internisten und hausärztliche Praxen.',
    color: colorGroups.blue,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Hausärztliche Versorgung', 'Vorsorge', 'Impfungen', 'Labor', 'EKG/Ultraschall', 'Hausbesuche'] },
        { label: 'Schwerpunkte', key: 'chips2', options: ['Innere Medizin', 'Naturheilverfahren', 'Akupunktur', 'Sportmedizin', 'Geriatrie'] },
        { label: 'Patienten', key: 'chips3', options: ['Familien', 'Senioren', 'Kinder', 'Berufstätige'] },
        { label: 'Praxis', key: 'chips4', options: ['Einzelpraxis', 'Gemeinschaftspraxis', 'MVZ'] }
      ],
      textareaLabel: 'Praxisphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Vertrauensvoll & Warm', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's2', name: 'Modern & Professionell', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's3', name: 'Freundlich & Hell', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's4', name: 'Klassisch & Seriös', gradient: 'linear-gradient(135deg, #4b5563, #1f2937)' }
      ],
      atmosphere: ['Kompetent', 'Menschlich', 'Modern', 'Beruhigend', 'Effizient']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Neue Patienten', 'Online-Termine', 'Kassenpatient', 'Privatpatient', 'Aufklärung', 'Prävention'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Team', 'Sprechzeiten', 'Kontakt/Anfahrt', 'Aktuelles', 'Rezeptbestellung'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Alle Kassen', 'Privatpraxis'] }
      ]
    },
    step5: { assets: ['Praxisfotos', 'Team-Portraits', 'Logo/Praxisschild', 'Texte/Leistungen', 'Domain', 'Doctolib', 'Website', 'Neustart'] }
  },
  {
    id: 'zahnmedizin',
    title: 'Zahnmedizin',
    description: 'Für Zahnärzte, Kieferorthopäden und Implantologen.',
    color: colorGroups.blue,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Prophylaxe', 'Implantologie', 'Ästhetik', 'Endodontie', 'Parodontologie', 'Kinderzahnheilkunde'] },
        { label: 'Schwerpunkte', key: 'chips2', options: ['Angstpatienten', 'Ganzheitlich', 'Bleaching', 'Invisalign'] },
        { label: 'Patienten', key: 'chips3', options: ['Erwachsene', 'Kinder', 'Senioren', 'Angstpatienten'] },
        { label: 'Praxis', key: 'chips4', options: ['Einzelpraxis', 'Gemeinschaftspraxis', 'Klinik'] }
      ],
      textareaLabel: 'Praxisphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Clean & Ästhetisch', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's2', name: 'Premium & Modern', gradient: 'linear-gradient(135deg, #2d3436, #000000)' },
        { id: 's3', name: 'Warm & Beruhigend', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's4', name: 'Hell & Freundlich', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' }
      ],
      atmosphere: ['Hochwertig', 'Schmerzfrei', 'Ästhetisch', 'Einfühlsam', 'Innovativ']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Neupatienten', 'Ästhetik-Fokus', 'Implantat-Beratung', 'Prophylaxe-Termine'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Team', 'Praxisrundgang', 'Kontakt', 'Online-Termine'],
      selects: [
        { label: 'Kasse & Zahlungsmodell', key: 'select1', options: ['Alle Kassen', 'Privat & Selbstzahler', 'Fokus auf Zuzahlung'] }
      ]
    },
    step5: { assets: ['Praxisfotos', 'Vorher-Nachher', 'Logo', 'Team-Portraits', 'Texte', 'Domain', 'Doctolib', 'Website', 'Neustart'] }
  },
  {
    id: 'dermatologie',
    title: 'Dermatologie',
    description: 'Für Hautärzte, Allergologen und ästhetische Medizin.',
    color: colorGroups.blue,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Hautkrebsvorsorge', 'Allergologie', 'Ästhetik', 'Lasertherapie', 'Venen', 'Haare'] },
        { label: 'Schwerpunkte', key: 'chips2', options: ['Klassische Dermatologie', 'Anti-Aging', 'Operativ', 'Kinderdermatologie'] },
        { label: 'Patienten', key: 'chips3', options: ['Alle Altersgruppen', 'Fokus Ästhetik', 'Privatpatienten'] }
      ],
      textareaLabel: 'Praxisphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Klinisch & Rein', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's2', name: 'Beauty & Premium', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's3', name: 'Modern & Hell', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's4', name: 'Sanft & Natürlich', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' }
      ],
      atmosphere: ['Ästhetisch', 'Kompetent', 'Diskret', 'Modern', 'Vertrauensvoll']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Vorsorge-Termine', 'Ästhetik-Beratung', 'Patienteninfo', 'Privatpatienten'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Ästhetik', 'Team', 'Kontakt', 'Online-Termine'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Alle Kassen', 'Privatpraxis'] }
      ]
    },
    step5: { assets: ['Praxisfotos', 'Geräte-Fotos', 'Logo', 'Team-Portraits', 'Texte', 'Domain', 'Website', 'Neustart'] }
  },
  {
    id: 'augenheilkunde',
    title: 'Augenheilkunde',
    description: 'Für Augenärzte, Augenkliniken und Laserzentren.',
    color: colorGroups.blue,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Vorsorge', 'Katarakt', 'Glaukom', 'Makula', 'Laser/Lasik', 'Sehschule'] },
        { label: 'Schwerpunkte', key: 'chips2', options: ['Konservativ', 'Operativ', 'Refraktiv', 'Kinderaugenheilkunde'] },
        { label: 'Patienten', key: 'chips3', options: ['Senioren', 'Kinder', 'Berufstätige', 'Brillenträger'] }
      ],
      textareaLabel: 'Praxisphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Klar & Fokussiert', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's2', name: 'High-Tech & Modern', gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' },
        { id: 's3', name: 'Vertrauensvoll & Hell', gradient: 'linear-gradient(135deg, #fdfbfb, #ebedee)' },
        { id: 's4', name: 'Premium & Seriös', gradient: 'linear-gradient(135deg, #4b5563, #1f2937)' }
      ],
      atmosphere: ['Präzise', 'Innovativ', 'Sicher', 'Erfahren', 'Freundlich']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Vorsorge-Termine', 'OP-Beratung', 'Lasik-Interessenten', 'Patienteninfo'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'OP-Spektrum', 'Team', 'Kontakt', 'Online-Termine'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Alle Kassen', 'Privatpraxis', 'Klinik'] }
      ]
    },
    step5: { assets: ['Praxisfotos', 'Geräte-Fotos', 'Logo', 'Team-Portraits', 'Texte', 'Domain', 'Website', 'Neustart'] }
  },
  {
    id: 'orthopadie',
    title: 'Orthopädie',
    description: 'Für Orthopäden, Unfallchirurgen und Sportmediziner.',
    color: colorGroups.blue,
    step2: {
      chipGroups: [
        { label: 'Leistungen', key: 'chips1', options: ['Konservativ', 'Operativ', 'Sportmedizin', 'Chirotherapie', 'Akupunktur', 'Stoßwelle'] },
        { label: 'Schwerpunkte', key: 'chips2', options: ['Wirbelsäule', 'Gelenke', 'Endoprothetik', 'Kinderorthopädie'] },
        { label: 'Patienten', key: 'chips3', options: ['Sportler', 'Senioren', 'Schmerzpatienten', 'Kinder'] }
      ],
      textareaLabel: 'Praxisphilosophie'
    },
    step3: {
      styles: [
        { id: 's1', name: 'Dynamisch & Sportlich', gradient: 'linear-gradient(135deg, #cfd9df, #e2ebf0)' },
        { id: 's2', name: 'Klinisch & Modern', gradient: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' },
        { id: 's3', name: 'Vertrauensvoll & Warm', gradient: 'linear-gradient(135deg, #e6e1d8, #c2b8a3)' },
        { id: 's4', name: 'Premium & Seriös', gradient: 'linear-gradient(135deg, #4b5563, #1f2937)' }
      ],
      atmosphere: ['Aktivierend', 'Kompetent', 'Erfahren', 'Modern', 'Ganzheitlich']
    },
    step4: {
      goalLabel: 'Hauptziel',
      goals: ['Terminbuchungen', 'OP-Aufklärung', 'Sportler ansprechen', 'Privatpatienten'],
      contentLabel: 'Inhalte',
      contents: ['Leistungen', 'Team', 'Praxis/Klinik', 'Kontakt', 'Online-Termine'],
      selects: [
        { label: 'Kasse', key: 'select1', options: ['Alle Kassen', 'Privatpraxis'] }
      ]
    },
    step5: { assets: ['Praxisfotos', 'OP-Dokumentation', 'Logo', 'Team-Portraits', 'Texte', 'Domain', 'Website', 'Neustart'] }
  }
];