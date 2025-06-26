
import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + (7 - endTime.getDay()));
      endTime.setHours(23, 59, 59, 999);
      
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      
      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
      const minutes = String(Math.floor(diff / 1000 / 60) % 60).padStart(2, "0");
      const seconds = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
      
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText("NEW20");
    toast.success("Rabattcode kopiert: NEW20");
  };

  return (
    <div className="mt-24 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white shadow-2xl animate-pulse">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">🔥 Neu Eröffnung: Spare 20% auf alle Hoodies!</h2>
        <p className="text-xl mb-6">Nur bis Sonntag! Sichere dir jetzt deinen Style.</p>
        
        <div className="bg-black/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm opacity-80">Rabattcode:</span>
              <div className="text-2xl font-bold">NEW20</div>
            </div>
            <button 
              onClick={copyCode}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          ⏳ Nur noch <span className="font-bold text-2xl">{timeLeft}</span> verfügbar!
        </div>
        
        <button  onClick={() => window.location.href = '/shop'}   className="bg-white text-red-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          Jetzt shoppen
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
