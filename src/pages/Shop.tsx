import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";
import LiveChat from "@/components/LiveChat";
import ParticleBackground from "@/components/ParticleBackground";

// Firebase
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "@/firebase";

const Shop = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("alle");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Firebase Live-Daten laden
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        console.error("Fehler beim Laden der Produkte:", err);
        setError("Produkte konnten nicht geladen werden.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filterfunktion
  const filteredProducts = activeFilter === "alle"
    ? products
    : products.filter(product => product.category === activeFilter);

  // In den Warenkorb legen
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M"
    });

    toast({
      title: "Zum Warenkorb hinzugefügt!",
      description: `${product.name} wurde erfolgreich hinzugefügt.`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-['Nunito'] overflow-x-hidden">
      <ParticleBackground />
      <Navigation
        onSidebarToggle={() => setSidebarOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Anime Shop
            </h1>
            <p className="text-xl text-gray-300 animate-slide-in-right">
              Premium Hoodies & Kleidung für echte Anime-Fans
            </p>
          </div>

          {/* Filterbuttons */}
          <div className="mb-8 animate-scale-in">
            <div className="flex flex-wrap gap-4 justify-center">
              {["alle", "hoodies", "tshirts", "accessoires"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50"
                      : "bg-black/20 hover:bg-purple-600/50 border border-purple-500/30"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Ladeanzeige / Fehler / Produktgrid */}
          {loading ? (
            <div className="text-center py-12 text-lg text-purple-300 animate-pulse">
              Lade Produkte...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-black/20 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        {product.badge}
                      </div>
                    )}

                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-green-400">
                          €{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            €{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-3 rounded-lg text-center font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm"
                        >
                          Details
                        </Link>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          title="In den Warenkorb"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">Keine Produkte gefunden</h3>
                  <p className="text-gray-400">Versuche einen anderen Filter</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <LiveChat />
    </div>
  );
};

export default Shop;
