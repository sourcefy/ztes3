import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Variants } from "framer-motion";

interface Review {
  id: string;
  userId?: string; // User-ID für Profil-Link
  userName: string;
  rating: number;
  comment: string;
  avatarUrl?: string; // Optional: Avatar URL, wenn in DB gespeichert
  date: {
    seconds: number;
  };
  approved: boolean;
}

const starVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.1 },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: "spring" as const, stiffness: 100 },
  }),
};

const ReviewsSection: React.FC = () => {
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("approved", "==", true),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviewsData: Review[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Review, "id">),
        }));
        setApprovedReviews(reviewsData);
        setLoading(false);
      },
      (error) => {
        console.error("Fehler beim Laden der Reviews:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-gray-300 text-center mt-8">Lade Bewertungen...</p>;
  }

  if (approvedReviews.length === 0) {
    return <p className="text-gray-400 text-center mt-8">Keine freigegebenen Bewertungen vorhanden.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {approvedReviews.map(({ id, userName, rating, comment, date, avatarUrl, userId }, i) => (
        <motion.article
          key={id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-gradient-to-tr from-purple-800 via-indigo-900 to-blue-900 rounded-xl shadow-lg p-6 flex flex-col hover:shadow-purple-500 transition-shadow duration-300"
        >
          <header className="flex items-center mb-4">
            {/* Avatar mit Fallback */}
            <Link to={userId ? `/profile/${userId}` : "#"} className="block flex-shrink-0">
              <img
                src={
                  avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&size=64`
                }
                alt={`${userName} Avatar`}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-600 hover:border-purple-400 transition-colors"
                loading="lazy"
              />
            </Link>

            <div className="ml-4 flex flex-col">
              <Link
                to={userId ? `/profile/${userId}` : "#"}
                className="text-white font-semibold text-lg hover:text-purple-400 transition-colors truncate max-w-xs"
                title={userName}
              >
                {userName || "Anonym"}
              </Link>
              <time
                className="text-gray-400 text-sm"
                dateTime={new Date(date.seconds * 1000).toISOString()}
                title={new Date(date.seconds * 1000).toLocaleString()}
              >
                {new Date(date.seconds * 1000).toLocaleDateString("de-DE")}
              </time>
            </div>
          </header>

          <div className="flex mb-4" aria-label={`Bewertung: ${rating} von 5 Sternen`}>
            {[...Array(5)].map((_, starIdx) => (
              <motion.span
                key={starIdx}
                custom={starIdx}
                variants={starVariants}
                initial="hidden"
                animate="visible"
                className={`text-yellow-400 text-2xl ${
                  starIdx < rating ? "animate-pulse" : "text-yellow-900"
                }`}
              >
                ★
              </motion.span>
            ))}
          </div>

          <p className="text-gray-300 flex-grow whitespace-pre-wrap leading-relaxed">{comment}</p>
        </motion.article>
      ))}
    </section>
  );
};

export default ReviewsSection;
