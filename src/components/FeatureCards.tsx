import { Rocket, Truck, Coins } from "lucide-react";

export default function FeatureCards() {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-2 mt-12 px-4">
      
      <div className="flex flex-col items-center bg-gradient-to-tr from-purple-700 via-purple-800 to-purple-900 text-white rounded-3xl shadow-lg p-8 max-w-xs mx-auto transform transition-transform hover:scale-105 cursor-pointer">
        <div className="bg-purple-900 rounded-full p-4 mb-4 shadow-md">
          <Rocket className="w-12 h-12 text-purple-300 animate-[bounce_1s_infinite]" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Schneller Versand</h3>
        <p className="text-purple-300 text-center text-sm leading-relaxed">
          Erhalte deine Bestellung blitzschnell dank unserem Premium Versandservice.
        </p>
      </div>
      
      <div className="flex flex-col items-center bg-gradient-to-tr from-green-600 via-green-700 to-green-800 text-white rounded-3xl shadow-lg p-8 max-w-xs mx-auto transform transition-transform hover:scale-105 cursor-pointer">
        <div className="bg-green-800 rounded-full p-4 mb-4 shadow-md">
          <Truck className="w-12 h-12 text-green-300 animate-[bounce_1s_infinite]" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Kostenloser Versand</h3>
        <p className="text-green-300 text-center text-sm leading-relaxed">
          Genieße kostenlosen Versand bei Bestellungen ab einem bestimmten Wert.
        </p>
      </div>
      
      <div className="flex flex-col items-center bg-gradient-to-tr from-yellow-500 via-yellow-600 to-yellow-700 text-white rounded-3xl shadow-lg p-8 max-w-xs mx-auto transform transition-transform hover:scale-105 cursor-pointer">
        <div className="bg-yellow-700 rounded-full p-4 mb-4 shadow-md">
          <Coins className="w-12 h-12 text-yellow-300 animate-[bounce_1s_infinite]" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Coins verdienen</h3>
        <p className="text-yellow-300 text-center text-sm leading-relaxed">
          Sammle Coins bei jedem Einkauf und löse sie gegen Rabatte ein.
        </p>
      </div>

    </div>
  );
}
