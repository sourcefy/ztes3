// src/pages/PaymentPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import ParticleBackground from "@/components/ParticleBackground";
import { motion } from "framer-motion";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth, User } from "@/contexts/AuthContext";

const VALID_COUPONS: Record<string, number> = {
  NEW20: 0.2,
  SAVE10: 0.1,
  FREESHIP: 0,
};

const PaymentPage = () => {
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userCredit, setUserCredit] = useState(100);
  const [isPaying, setIsPaying] = useState(false);

  const { user, loading } = useAuth();
  const { state, clearCart } = useCart();
  const cartItems = state.items;
  const { toast } = useToast();

  const total = locationState?.total || 0;

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountName, setDiscountName] = useState<string | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const discountAmount = total * discount;
  const finalTotal = total - discountAmount;

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Nicht eingeloggt",
        description: "Bitte melde dich an, um fortzufahren.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [loading, user, toast, navigate]);

  useEffect(() => {
    if (total === 0) {
      toast({
        title: "Ungültiger Betrag",
        description: "Bitte gehe über den Warenkorb zur Zahlung.",
        variant: "destructive",
      });
      navigate("/cart");
    }
  }, [total, toast, navigate]);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code in VALID_COUPONS) {
      const value = VALID_COUPONS[code];
      setDiscount(value);
      setDiscountName(code);
      toast({
        title: "Gutschein angewandt",
        description:
          value > 0
            ? `${(value * 100).toFixed(0)}% Rabatt wurde angewandt.`
            : "Versandkostenfrei aktiviert.",
      });
    } else {
      setDiscount(0);
      setDiscountName(null);
      toast({
        title: "Ungültiger Gutschein",
        description: "Bitte geben Sie einen gültigen Rabattcode ein.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Zahlungsmethode wählen",
        description: "Bitte wählen Sie zuerst eine Zahlungsmethode aus.",
        variant: "destructive",
      });
      return;
    }

    if (finalTotal <= 0) {
      toast({
        title: "Ungültiger Betrag",
        description: "Der Betrag muss größer als 0 sein.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Nicht eingeloggt",
        description: "Bitte melde dich an, um fortzufahren.",
        variant: "destructive",
      });
      return;
    }

    setIsPaying(true);

    try {
      if (selectedMethod === "credit") {
        if (userCredit < finalTotal) {
          toast({
            title: "Nicht genügend Guthaben",
            description: `Dein Guthaben reicht nicht für die Zahlung von €${finalTotal.toFixed(
              2
            )}.`,
            variant: "destructive",
            duration: 5000,
          });
          setIsPaying(false);
          return;
        }
        setUserCredit((prev) => prev - finalTotal);
      }

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName || user.email || "Unbekannt",
        items: cartItems,
        amount: finalTotal,
        paymentMethod: selectedMethod,
        status: "Bezahlt",
        date: Timestamp.now(),
      });

      clearCart();

      toast({
        title: "Zahlung erfolgreich 🎉",
        description: `€${finalTotal.toFixed(2)} wurden erfolgreich mit ${selectedMethod} bezahlt.`,
        duration: 5000,
      });

      navigate("/success", { state: { total: finalTotal } });
    } catch {
      toast({
        title: "Fehler bei der Zahlung",
        description: "Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsPaying(false);
    }
  };

  const getButtonClass = (method: string) =>
    `w-full py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-3 ${
      selectedMethod === method
        ? "ring-4 ring-purple-400 bg-gradient-to-r from-purple-700 to-pink-700"
        : "bg-black/30 hover:bg-black/50"
    }`;

  if (loading) return <div className="text-center text-white pt-40">Lade...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-['Nunito'] relative overflow-hidden">
      <ParticleBackground />
      <Navigation onSidebarToggle={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-24 px-6 max-w-3xl mx-auto space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-8 text-center tracking-wide drop-shadow-lg"
        >
          Bezahlung
        </motion.h1>

        <section className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-lg">
          <div className="text-center mb-6">
            <p className="text-xl font-semibold">
              Gesamtbetrag: <span className="text-purple-400">€{total.toFixed(2)}</span>
            </p>
            {discountName && (
              <p className="mt-1 text-green-400">
                Gutschein <span className="uppercase font-bold">{discountName}</span> angewandt: -€{discountAmount.toFixed(2)}
              </p>
            )}
            <p className="mt-3 text-3xl font-extrabold text-white">
              Endbetrag: €{finalTotal.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-3 mb-8">
            <input
              type="text"
              placeholder="Gutschein-Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-grow rounded-lg px-4 py-3 text-black font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={applyCoupon}
              className="bg-gradient-to-r from-purple-700 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-6 rounded-lg transition-all duration-300 shadow-lg"
            >
              Anwenden
            </button>
          </div>

          <div className="space-y-4 mb-10">
            <p className="text-lg font-semibold mb-3">Zahlungsmethode wählen:</p>

            <button
              className={getButtonClass("credit")}
              onClick={() => setSelectedMethod("credit")}
              disabled={isPaying}
            >
              Guthaben bezahlen
            </button>
            <button
              className={getButtonClass("paypal")}
              onClick={() => setSelectedMethod("paypal")}
              disabled={isPaying}
            >
              PayPal
            </button>
            <button
              className={getButtonClass("creditcard")}
              onClick={() => setSelectedMethod("creditcard")}
              disabled={isPaying}
            >
              Kreditkarte
            </button>
          </div>

          <button
            onClick={handlePayment}
            disabled={isPaying}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-extrabold hover:from-pink-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaying ? "Bitte warten..." : "Jetzt bezahlen"}
          </button>
        </section>
      </main>
    </div>
  );
};

export default PaymentPage;
