
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, Coins, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProps {
  onSidebarToggle: () => void;
  onSettingsOpen?: () => void;
}



const Navigation = ({ onSidebarToggle, onSettingsOpen }: NavigationProps) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <button 
          onClick={onSidebarToggle}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-8 h-8" />
        </button>

        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-purple-300 transition-colors">
            Shop
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Coins">
            <Coins className="w-6 h-6" />
          </button>
          
          <Link to="/cart" className="p-2 hover:bg-white/10 rounded-lg transition-colors relative" title="Warenkorb">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          <div className="relative">
            {user ? (
              <>
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold hover:scale-110 transition-transform"
                >
                  {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 py-2">
                    <div className="px-4 py-2 border-b border-gray-600">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-white/10 transition-colors" onClick={() => setProfileMenuOpen(false)}>
                      👤 Profil
                    </Link>
                    <button 
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onSettingsOpen();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                      ⚙️ Einstellungen
                    </button>
                    <Link to="/shop" className="block px-4 py-2 hover:bg-white/10 transition-colors" onClick={() => setProfileMenuOpen(false)}>
                      🛍️ Shop
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/dashboard" className="block px-4 py-2 hover:bg-white/10 transition-colors" onClick={() => setProfileMenuOpen(false)}>
                        📊 Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-red-400"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Abmelden
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link 
                to="/auth"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
