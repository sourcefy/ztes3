import { useState } from "react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";
import LiveChat from "@/components/LiveChat";
import ParticleBackground from "@/components/ParticleBackground";

const Impressum = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-['Nunito'] overflow-x-hidden">
      <ParticleBackground />
      
      <Navigation 
        onSidebarToggle={() => setSidebarOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />

      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse leading-tight">
              Impressum
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto animate-slide-in-right">
              Angaben gemäß § 5 TMG
            </p>
          </div>

          <article className="space-y-10 text-gray-300">
            <section>
              <h2 className="text-3xl font-semibold mb-4">Angaben zum Unternehmen</h2>
              <p className="text-base leading-relaxed max-w-prose">
                <strong>DeinShop GmbH</strong><br/>
                Musterstraße 1<br/>
                12345 Musterstadt<br/>
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Vertreten durch</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Geschäftsführer: Max Mustermann
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Kontakt</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Telefon: <a href="tel:+491234567890" className="text-purple-400 underline">+49 123 4567890</a><br/>
                E-Mail: <a href="mailto:info@deinshop.de" className="text-purple-400 underline">info@deinshop.de</a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Umsatzsteuer-ID</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br/>
                DE123456789
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Handelsregister</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Eingetragen im Handelsregister.<br/>
                Registergericht: Amtsgericht Musterstadt<br/>
                Registernummer: HRB 123456
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Haftungsausschluss</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
            </section>
          </article>
        </div>
      </main>

      <LiveChat />
    </div>
  );
};

export default Impressum;
