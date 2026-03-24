import React from 'react';
import { Helmet } from 'react-helmet';
import StickyNav from '@/components/StickyNav.jsx';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-[#edf0f7] font-sans">
      <Helmet>
        <title>Impressum · agensia</title>
      </Helmet>
      
      <StickyNav />

      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif mb-12 text-[#d4a850]">Impressum</h1>
        
        <div className="space-y-8 text-[#a8b0c5] leading-relaxed">
          <section>
            <h2 className="text-xl font-medium text-[#edf0f7] mb-4">Angaben gemäß § 5 TMG</h2>
            <p>
              agensia Webdesign<br />
              Musterstraße 123<br />
              10115 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#edf0f7] mb-4">Vertreten durch</h2>
            <p>Max Mustermann</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#edf0f7] mb-4">Kontakt</h2>
            <p>
              Telefon: +49 (0) 123 44 55 66<br />
              E-Mail: hallo@agensia.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#edf0f7] mb-4">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              DE999999999
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#edf0f7] mb-4">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#d4a850] hover:underline ml-1">
                https://ec.europa.eu/consumers/odr
              </a>.<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p className="mt-4">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}