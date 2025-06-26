import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/firebase"; // Firebase-Konfiguration
import { collection, addDoc, Timestamp } from "firebase/firestore";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const total = location.state?.total ?? 0;
  const orderId = location.state?.orderId ?? null;

  // Review States
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Bewertung absenden
  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Bitte wählen Sie eine Bewertung (1-5 Sterne) aus.");
      return;
    }
    if (comment.trim().length < 10) {
      alert("Bitte geben Sie einen ausführlichen Kommentar ein (mindestens 10 Zeichen).");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "reviews"), {
        orderId,
        rating,
        comment: comment.trim(),
        date: Timestamp.now(),
      });
      setSubmitted(true);
    } catch (error) {
      alert("Fehler beim Absenden der Bewertung. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Einfaches Stern-Auswahl UI
  const Star = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
    <svg
      onClick={onClick}
      className={`w-8 h-8 cursor-pointer ${filled ? "text-yellow-400" : "text-gray-400"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.37-2.447a1 1 0 00-1.176 0l-3.37 2.447c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.037 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex flex-col items-center justify-center px-6 py-16 text-white font-sans relative">
      {/* Erfolgsmeldung */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-lg w-full text-center shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-xl"
        >
          <CheckCircle2 className="text-white w-12 h-12" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-4xl font-extrabold mb-4"
        >
          Bestellung erfolgreich!
        </motion.h1>

        {orderId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="text-lg mb-3 font-mono tracking-wide"
          >
            Bestellnummer: <span className="font-bold">{orderId}</span>
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="text-lg mb-8"
        >
          Gesamtbetrag: <span className="font-semibold">€{total.toFixed(2)}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="mb-10 text-gray-200 leading-relaxed"
        >
          Vielen Dank für Ihren Einkauf! Ihre Bestellung wird bearbeitet und Sie erhalten bald eine Bestätigung per E-Mail.
        </motion.p>

        {/* Review Formular */}
        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Bewertung abgeben</h2>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} filled={star <= rating} onClick={() => setRating(star)} />
              ))}
            </div>
            <textarea
              className="w-full p-3 rounded-lg text-black resize-none mb-4"
              rows={4}
              placeholder="Schreiben Sie hier Ihren Kommentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors px-6 py-3 rounded-lg font-semibold text-white shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Bewertung wird gesendet..." : "Bewertung absenden"}
            </button>
          </>
        ) : (
          <p className="text-green-300 mt-4 font-semibold">Danke für Ihre Bewertung!</p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/shop")}
          className="mt-8 bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors px-10 py-4 rounded-full font-semibold text-white shadow-lg"
        >
          Zurück zum Shop
        </motion.button>
      </motion.div>

      {/* Hintergrund Animationen */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 bg-green-500 rounded-full opacity-30 blur-3xl animate-pulse"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1.2 }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-green-400 rounded-full opacity-20 blur-2xl animate-pulse"
        initial={{ scale: 1.1 }}
        animate={{ scale: 0.8 }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default SuccessPage;
