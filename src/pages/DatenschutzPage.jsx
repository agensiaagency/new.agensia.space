import React from 'react';
import { Helmet } from 'react-helmet';
import StickyNav from '@/components/StickyNav.jsx';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-[#edf0f7] font-sans">
      <Helmet>
        <title>Datenschutzerklärung · agensia</title>
      </Helmet>
      
      <StickyNav />

      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif mb-12 text-[#d4a850]">Datenschutzerklärung</h1>
        
        <div className="space-y-8 text-[#a8b0c5] leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-[#edf0f7] mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium text-[#edf0f7] mb-2 mt-6">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
            
            <h3 className="text-lg font-medium text-[#edf0f7] mb-2 mt-6">Datenerfassung auf dieser Website</h3>
            <p className="mb-2"><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#edf0f7] mb-4">2. Hosting und Content Delivery Networks (CDN)</h2>
            <p>
              Wir hosten die Inhalte unserer Website bei folgenden Anbietern:
            </p>
            <h3 className="text-lg font-medium text-[#edf0f7] mb-2 mt-4">Externes Hosting</h3>
            <p>
              Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#edf0f7] mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-lg font-medium text-[#edf0f7] mb-2 mt-4">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-[#edf0f7] mb-4">4. Datenerfassung auf dieser Website</h2>
            <h3 className="text-lg font-medium text-[#edf0f7] mb-2 mt-4">Cookies</h3>
            <p>
              Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
            </p>
            
            <h3 className="text-lg font-medium text-[#edf0f7] mb-2 mt-6">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}