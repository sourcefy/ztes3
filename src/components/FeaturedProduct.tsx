
import { useState } from "react";

const FeaturedProduct = () => {
  const [imageScale, setImageScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
    setImageScale(1.2);
  };

  const handleMouseLeave = () => {
    setImageScale(1);
    setTransformOrigin("center center");
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="relative">
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            NEU
          </div>
          <div 
            className="overflow-hidden rounded-xl cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop"
              alt="Premium Anime Hoodie"
              className="w-full h-96 object-cover transition-transform duration-300"
              style={{
                transform: `scale(${imageScale})`,
                transformOrigin: transformOrigin
              }}
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-bold">Premium Anime Hoodie</h2>
          <p className="text-xl text-gray-300">
            Limitierter Oversize-Hoodie mit hochwertigem Design.
          </p>
          
          <ul className="space-y-3 text-lg">
            <li className="flex items-center gap-3">
              <span>🌸</span> Extra weiches Innenfutter
            </li>
            <li className="flex items-center gap-3">
              <span>⚡</span> Anime-Design mit Druck in HD
            </li>
            <li className="flex items-center gap-3">
              <span>🧼</span> Waschmaschinenfest & langlebig
            </li>
          </ul>
          
          <div className="text-2xl">
            <span className="line-through text-gray-400">49,99€</span>
            <span className="text-green-400 font-bold ml-4">29,99€</span>
          </div>
          
          <div className="bg-red-500/20 border border-red-500 p-3 rounded-lg">
            🔥 Diese Woche mit Code: <strong>NEW20</strong>
          </div>
          
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105">
            Jetzt kaufen
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
