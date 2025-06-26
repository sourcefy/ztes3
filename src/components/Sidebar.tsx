
import { X, Home, ShoppingBag, User, Calendar, Users, Phone } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingBag, label: "Shop", href: "/shop" },
    { icon: Phone, label: "Kontakt", href: "#" },
      { icon: Users, label: "Impressum", href: "/impressum" },
  { icon: User, label: "Datenschutz", href: "/datenschutz" },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-md border-r border-white/10 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Menü</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                onClick={onClose}
              >
                <item.icon className="w-5 h-5 group-hover:text-purple-300" />
                <span className="group-hover:text-purple-300">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
