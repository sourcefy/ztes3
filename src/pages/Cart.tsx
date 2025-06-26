import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import ParticleBackground from "@/components/ParticleBackground";

const Cart = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "NEW20") {
      setDiscount(0.2);
      toast({
        title: "Rabattcode angewandt!",
        description: "20% Rabatt wurde erfolgreich angewandt.",
      });
    } else {
      toast({
        title: "Ungültiger Code",
        description: "Dieser Rabattcode ist nicht gültig.",
        variant: "destructive",
      });
    }
  };

  const subtotal = state.total;
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  const handleCheckout = () => {
    toast({
      title: "Weiterleitung zur Bezahlung",
      description: `Gesamtbetrag: €${finalTotal.toFixed(2)}.`,
    });

    navigate("/payment", {
      state: { total: finalTotal },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-['Nunito']">
      <ParticleBackground />

      <Navigation
        onSidebarToggle={() => setSidebarOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Warenkorb ({state.items.length})
            </h1>
            <Link
              to="/shop"
              className="text-purple-300 hover:text-white transition-colors"
            >
              ← Weiter einkaufen
            </Link>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Ihr Warenkorb ist leer</h2>
              <p className="text-gray-300 mb-8">
                Entdecken Sie unsere fantastischen Anime-Produkte!
              </p>
              <Link
                to="/shop"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Jetzt shoppen
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {state.items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="bg-black/20 backdrop-blur-md rounded-xl p-6 flex items-center gap-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-300">Größe: {item.size}</p>
                      <p className="text-green-400 font-bold">€{item.price}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-black/20 hover:bg-purple-600 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-black/20 hover:bg-purple-600 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 h-fit">
                <h2 className="text-2xl font-bold mb-6">Bestellübersicht</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Zwischensumme:</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Rabatt ({(discount * 100)}%):</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Versand:</span>
                    <span className="text-green-400">Kostenlos</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Gesamt:</span>
                      <span className="text-green-400">
                        €{finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Rabattcode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-black/20 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Anwenden
                    </button>
                  </div>

                  <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
                    <p className="text-sm">🔥 Code "NEW20" für 20% Rabatt!</p>
                  </div>

<button
  onClick={handleCheckout}
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
>
  <CreditCard className="w-5 h-5" />
  Jetzt bezahlen – €{finalTotal.toFixed(2)}
</button>


                  <button
                    onClick={clearCart}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg transition-colors"
                  >
                    Warenkorb leeren
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
