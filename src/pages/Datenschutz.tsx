import { useState } from "react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";
import LiveChat from "@/components/LiveChat";
import ParticleBackground from "@/components/ParticleBackground";

const Datenschutz = () => {
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
              Datenschutz
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto animate-slide-in-right">
              Informationen zum Schutz Ihrer personenbezogenen Daten bei Nutzung unseres Online-Shops.
            </p>
          </div>

          <article className="space-y-10 text-gray-300">
            <section>
              <h2 className="text-3xl font-semibold mb-4">1. Verantwortlicher</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br/>
                <strong>DeinShop GmbH</strong><br/>
                Musterstraße 1<br/>
                12345 Musterstadt<br/>
                E-Mail: <a href="mailto:info@deinshop.de" className="text-purple-400 underline">info@deinshop.de</a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Wir erheben nur Daten, die für die Vertragsdurchführung, Kundenbetreuung und zur Verbesserung unseres Angebots notwendig sind. Dazu zählen u.a. Name, Anschrift, E-Mail-Adresse, Zahlungsinformationen und Bestelldaten.
              </p>
              <p className="text-base leading-relaxed max-w-prose mt-2">
                Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie ggf. Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">3. Cookies und Tracking</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Unser Online-Shop verwendet Cookies, um die Nutzung zu erleichtern, den Warenkorb zu speichern und Besucherzahlen zu analysieren.
              </p>
              <p className="text-base leading-relaxed max-w-prose mt-2">
                Wir nutzen z.B. Google Analytics (mit IP-Anonymisierung) zur Optimierung unseres Angebots. Sie können Cookies in Ihrem Browser jederzeit deaktivieren, dies kann jedoch die Funktionalität einschränken.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">4. Weitergabe von Daten an Dritte</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Zur Abwicklung der Bestellung geben wir Ihre Daten an Versanddienstleister und Zahlungsanbieter weiter. Diese sind verpflichtet, Ihre Daten vertraulich zu behandeln.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">5. Ihre Rechte</h2>
              <ul className="list-disc list-inside space-y-2 text-base leading-relaxed max-w-prose">
                <li>Auskunft über Ihre gespeicherten personenbezogenen Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung oder Einschränkung der Verarbeitung</li>
                <li>Widerspruch gegen die Datenverarbeitung</li>
                <li>Widerruf einer erteilten Einwilligung</li>
                <li>Datenübertragbarkeit</li>
              </ul>
              <p className="mt-2">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte per E-Mail an <a href="mailto:datenschutz@deinshop.de" className="text-purple-400 underline">datenschutz@deinshop.de</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">6. Datensicherheit</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Wir verwenden technische und organisatorische Maßnahmen, um Ihre Daten gegen Verlust, Missbrauch und unbefugten Zugriff zu schützen.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">7. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die jeweils aktuelle Version finden Sie jederzeit auf unserer Website.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">8. Kontakt zum Datenschutzbeauftragten</h2>
              <p className="text-base leading-relaxed max-w-prose">
                Falls vorhanden, können Sie sich bei Fragen oder Beschwerden auch an unseren Datenschutzbeauftragten wenden:<br/>
                Datenschutzbeauftragter<br/>
                DeinShop GmbH<br/>
                Musterstraße 1<br/>
                12345 Musterstadt<br/>
                E-Mail: <a href="mailto:datenschutz@deinshop.de" className="text-purple-400 underline">datenschutz@deinshop.de</a>
              </p>
            </section>
          </article>
        </div>
      </main>

      <LiveChat />
    </div>
  );
};

export default Datenschutz;
