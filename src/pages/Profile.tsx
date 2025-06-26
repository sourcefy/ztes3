
import { useState } from "react";
import { User, Package, Heart, Settings, Bell, CreditCard } from "lucide-react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import ParticleBackground from "@/components/ParticleBackground";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 59.98,
      status: "Geliefert",
      items: 2
    },
    {
      id: "ORD-002", 
      date: "2024-01-10",
      total: 34.99,
      status: "Unterwegs",
      items: 1
    }
  ];

  const favorites = [
    {
      id: 1,
      name: "Anime Hoodie Classic",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Dragon Ball Z Hoodie", 
      price: 34.99,
      image: "https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=200&h=200&fit=crop"
    }
  ];

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 h-fit">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  U
                </div>
                <h2 className="text-xl font-bold">Max Mustermann</h2>
                <p className="text-gray-300">max@example.com</p>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeTab === "profile" ? "bg-purple-600" : "hover:bg-white/10"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profil
                </button>
                <button 
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeTab === "orders" ? "bg-purple-600" : "hover:bg-white/10"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  Bestellungen
                </button>
                <button 
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeTab === "favorites" ? "bg-purple-600" : "hover:bg-white/10"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Favoriten
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeTab === "settings" ? "bg-purple-600" : "hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Einstellungen
                </button>
              </nav>
            </div>

            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6">
                  <h1 className="text-3xl font-bold mb-6">Mein Profil</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Vorname</label>
                      <input 
                        type="text" 
                        defaultValue="Max" 
                        className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nachname</label>
                      <input 
                        type="text" 
                        defaultValue="Mustermann" 
                        className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">E-Mail</label>
                      <input 
                        type="email" 
                        defaultValue="max@example.com" 
                        className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Adresse</label>
                      <input 
                        type="text" 
                        placeholder="Straße und Hausnummer" 
                        className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">PLZ</label>
                      <input 
                        type="text" 
                        placeholder="12345" 
                        className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stadt</label>
                      <input 
                        type="text" 
                        placeholder="Berlin" 
                        className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                    Profil speichern
                  </button>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6">
                  <h1 className="text-3xl font-bold mb-6">Meine Bestellungen</h1>
                  
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-black/20 border border-gray-600 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">Bestellung {order.id}</h3>
                            <p className="text-gray-300">Bestellt am {order.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            order.status === "Geliefert" ? "bg-green-600" : "bg-blue-600"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-gray-300">{order.items} Artikel</p>
                          <p className="text-xl font-bold text-green-400">€{order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "favorites" && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6">
                  <h1 className="text-3xl font-bold mb-6">Meine Favoriten</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((item) => (
                      <div key={item.id} className="bg-black/20 border border-gray-600 rounded-xl p-6">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full aspect-square object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                        <p className="text-green-400 font-bold text-xl">€{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6">
                  <h1 className="text-3xl font-bold mb-6">Einstellungen</h1>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5" />
                        <span>E-Mail Benachrichtigungen</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        <span>Newsletter abonnieren</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors">
                      Konto löschen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
