import React from 'react';
import { Check } from 'lucide-react';

export default function ProjectDetailsPage() {
  const features = [
    'Individuelles Design',
    'Responsive (Mobile Ready)',
    'Kontaktformular',
    'Basic SEO',
    'DSGVO-konform',
    'Blog oder Portfolio',
    'Terminbuchung Integration'
  ];

  const timeline = [
    { phase: 'Briefing & Strategie', date: 'Woche 1', desc: 'Ziele definieren, Zielgruppe analysieren, Struktur planen.' },
    { phase: 'Design Konzept', date: 'Woche 2', desc: 'Erstellung des visuellen Konzepts (Farben, Typografie, Layout).' },
    { phase: 'Entwicklung', date: 'Woche 3-4', desc: 'Technische Umsetzung und Integration aller Funktionen.' },
    { phase: 'Review & Feedback', date: 'Woche 5', desc: 'Gemeinsame Prüfung und Einarbeitung von Änderungswünschen.' },
    { phase: 'Launch', date: 'Woche 6', desc: 'Finale Tests, SEO-Setup und Live-Gang der Website.' }
  ];

  return (
    <div className="max-w-5xl space-y-8">
      <h2 className="font-serif text-3xl text-[#edf0f7] mb-2">Mein Projekt</h2>
      <p className="text-[#a8b0c5] mb-8">Alle Details zu deinem aktuellen Website-Projekt.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-6">
            <h3 className="font-serif text-xl text-[#edf0f7] mb-4">Paket Details</h3>
            <div className="text-2xl font-mono text-[#d4a850] mb-6">Professional</div>
            <ul className="space-y-3">
              {features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-[#a8b0c5] text-sm">
                  <Check size={16} className="text-[#d4a850] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-6">
            <h3 className="font-serif text-xl text-[#edf0f7] mb-3">Nächste Schritte</h3>
            <p className="text-[#a8b0c5] text-sm leading-relaxed">
              Bitte fülle die Aufgaben im Aufgaben-Bereich aus. Sobald wir alle nötigen Informationen haben, starten wir mit der Design-Phase.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-8">
          <h3 className="font-serif text-2xl text-[#edf0f7] mb-8">Projekt Zeitplan</h3>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[rgba(255,255,255,0.1)] before:to-transparent">
            {timeline.map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(255,255,255,0.2)] bg-[#08090d] text-[#5e6680] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10">
                  {i + 1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[12px] border border-[rgba(255,255,255,0.05)] bg-[rgba(12,14,20,0.7)]">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-[#edf0f7]">{item.phase}</h4>
                    <span className="text-xs font-mono text-[#d4a850]">{item.date}</span>
                  </div>
                  <p className="text-sm text-[#a8b0c5]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}