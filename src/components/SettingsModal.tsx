import { useState } from "react";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [currentView, setCurrentView] = useState("start");
  const [selectedTheme, setSelectedTheme] = useState({ primary: "#4a13a2", secondary: "#a855f7" });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const themes = [
    { primary: "#4a13a2", secondary: "#a855f7" },
    { primary: "#0a84ff", secondary: "#38bdf8" },
    { primary: "#c5550a", secondary: "#f97316" },
    { primary: "#2ecc71", secondary: "#16a34a" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-md rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Einstellungen</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {currentView === "start" && (
            <div className="space-y-4">
              <button 
                onClick={() => setCurrentView("design")}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors"
              >
                🎨 Design
              </button>
              <button 
                onClick={() => setCurrentView("language")}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors"
              >
                🌐 Sprache
              </button>
              <button 
                onClick={() => setCurrentView("notifications")}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg text-left transition-colors"
              >
                🔔 Benachrichtigungen
              </button>
            </div>
          )}

          {currentView === "design" && (
            <div className="space-y-6">
              <button 
                onClick={() => setCurrentView("start")}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Zurück
              </button>
              <h3 className="text-xl font-bold">🎨 Design ändern</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTheme(theme)}
                    className={`h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedTheme.primary === theme.primary ? 'border-white' : 'border-transparent'
                    }`}
                  >
                    <div className="flex h-full">
                      <div className="w-1/2" style={{ backgroundColor: theme.primary }}></div>
                      <div className="w-1/2" style={{ backgroundColor: theme.secondary }}></div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Speichern
              </button>
            </div>
          )}

          {currentView === "language" && (
            <div className="space-y-6">
              <button 
                onClick={() => setCurrentView("start")}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Zurück
              </button>
              <h3 className="text-xl font-bold">🌐 Sprache wählen</h3>
              
              <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                <option value="de">Deutsch</option>
                <option value="en">Englisch</option>
                <option value="es">Spanisch</option>
                <option value="fr">Französisch</option>
              </select>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Speichern
              </button>
            </div>
          )}

          {currentView === "notifications" && (
            <div className="space-y-6">
              <button 
                onClick={() => setCurrentView("start")}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Zurück
              </button>
              <h3 className="text-xl font-bold">🔔 Benachrichtigungen</h3>
              
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span>Benachrichtigungen aktivieren</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className="
                    w-11 h-6 bg-gray-300 rounded-full relative
                    peer-checked:bg-purple-600
                    transition-colors
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                    after:bg-white after:border after:border-gray-300 after:rounded-full
                    after:h-5 after:w-5 after:transition-transform
                    peer-checked:after:translate-x-5
                    peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-2
                  "
                />
              </label>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Speichern
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
