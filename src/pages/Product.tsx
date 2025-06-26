import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import LiveChat from "@/components/LiveChat";
import ParticleBackground from "@/components/ParticleBackground";

const Product = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = {
    id: id,
    name: "Anime Hoodie Classic",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium Anime Hoodie mit hochwertigem HD-Druck. Extra weiches Innenfutter für maximalen Komfort.",
    features: [
      "🌸 Extra weiches Innenfutter",
      "⚡ Anime-Design mit Druck in HD",
      "🧼 Waschmaschinenfest & langlebig",
      "🎯 Limitierte Auflage"
    ]
  };

  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    addItem({
      id: parseInt(id || "1"),
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity: quantity
    });

    toast({
      title: "Zum Warenkorb hinzugefügt!",
      description: `${quantity}x ${product.name} (Größe: ${selectedSize}) wurde hinzugefügt.`,
      duration: 3000,
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
          <Link to="/shop" className="inline-flex items-center text-purple-300 hover:text-white mb-8 transition-colors">
            ← Zurück zum Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-black/20 backdrop-blur-md rounded-xl overflow-hidden">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-purple-500' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                      />
                    ))}
                    <span className="ml-2 text-gray-300">({product.reviews} Bewertungen)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-green-400">€{product.price}</span>
                  <span className="text-xl text-gray-400 line-through">€{product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -40%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Größe wählen</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size 
                          ? 'border-purple-500 bg-purple-500 text-white' 
                          : 'border-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Anzahl</h3>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-black/20 hover:bg-purple-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-black/20 hover:bg-purple-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  In den Warenkorb ({quantity})
                </button>
                <button className="w-14 h-14 bg-black/20 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Produktdetails</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-300">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LiveChat />
    </div>
  );
};

export default Product;
