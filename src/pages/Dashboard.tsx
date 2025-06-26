import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Bell,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import SettingsModal from "@/components/SettingsModal";
import ParticleBackground from "@/components/ParticleBackground";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate(user ? "/" : "/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null;
  }

  // Products
  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Orders
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Reviews (neu)
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Revenue Data
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const buckets = Array(24).fill(0);
    const labels = [];
    for (let i = 0; i < 24; i++) {
      const time = new Date(start.getTime() + i * 60 * 60 * 1000);
      labels.push(
        time.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
      );
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      if (orderDate >= start && orderDate <= now) {
        const hourIndex = Math.floor(
          (orderDate.getTime() - start.getTime()) / (60 * 60 * 1000)
        );
        buckets[hourIndex] += order.amount;
      }
    });

    setRevenueData(buckets.map((rev, i) => ({ time: labels[i], revenue: rev })));
  }, [orders]);

  const totalRevenue = orders.reduce((sum, order) => {
    if (order.amount && typeof order.amount === "number") {
      return sum + order.amount;
    }
    return sum;
  }, 0);

  const stats = [
    {
      title: "Benutzer",
      value: users.length.toString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Produkte",
      value: products.length.toString(),
      icon: Package,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Bestellungen",
      value: orders.length.toString(),
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Live Umsatz",
      value: `€${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // Review Freigabe Funktion
  const approveReview = async (id) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await updateDoc(reviewRef, { approved: true });
    } catch (error) {
      console.error("Fehler beim Freigeben der Bewertung:", error);
    }
  };

  // Review Löschen Funktion
  const deleteReview = async (id) => {
    try {
      const reviewRef = doc(db, "reviews", id);
      await deleteDoc(reviewRef);
    } catch (error) {
      console.error("Fehler beim Löschen der Bewertung:", error);
    }
  };

  const tabs = ["overview", "users", "products", "orders", "reviews"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-['Nunito']">
      <ParticleBackground />
      <Navigation
        onSidebarToggle={() => setSidebarOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <main className="relative z-10 pt-20 px-4 max-w-7xl mx-auto">
        {/* Header mit Admin-Management Button */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-1">Willkommen, {user.username}!</p>
            <button
              onClick={() => navigate("/admin-management")}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              Zur Admin-Verwaltung
            </button>
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            Benachrichtigungen
          </button>
        </div>

        {/* Statistiken Kacheln */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map(({ title, value, icon: Icon, color }) => (
            <div
              key={title}
              className={`bg-gradient-to-r ${color} p-5 rounded-xl shadow-md flex items-center justify-between`}
            >
              <div>
                <h3 className="text-white/80 text-sm font-semibold">{title}</h3>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
              <Icon className="w-10 h-10 text-white/80" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-black/20 text-gray-300 hover:bg-purple-600/50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Inhalte */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Umsatz Chart */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 min-h-[300px]">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Live Umsatz (letzte 24h)
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </h3>
              <ChartContainer
                config={{ revenue: { label: "Umsatz", color: "hsl(var(--chart-1))" } }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="time" stroke="#888" fontSize={11} />
                    <YAxis stroke="#888" fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Neueste Bestellungen kompakt */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 overflow-auto max-h-[300px]">
              <h3 className="text-xl font-bold mb-4">Neueste Bestellungen</h3>
              {orders.length === 0 && <p className="text-gray-400">Keine Bestellungen vorhanden.</p>}
              <ul className="divide-y divide-gray-700">
                {orders.slice(0, 8).map((order) => (
                  <li
                    key={order.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-gray-400 text-sm">
                        Kunde: {order.userName || order.userId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">
                        €{order.amount.toFixed(2)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Bezahlt"
                            ? "bg-green-600"
                            : order.status === "Versendet"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 overflow-auto max-h-[500px]">
            <h3 className="text-xl font-bold mb-6">Benutzerverwaltung</h3>
            <table className="w-full table-auto border-collapse text-gray-200">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">E-Mail</th>
                  <th className="text-left p-3">Rolle</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-700 hover:bg-white/5"
                  >
                    <td className="p-3">{u.name}</td>
                    <td className="p-3 text-gray-300">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.role === "admin" ? "bg-red-600" : "bg-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.status === "aktiv" ? "bg-green-600" : "bg-gray-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 overflow-auto max-h-[500px]">
            <h3 className="text-xl font-bold mb-6">Produktübersicht</h3>
            <table className="w-full table-auto border-collapse text-gray-200">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Preis</th>
                  <th className="text-left p-3">Lagerbestand</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-700 hover:bg-white/5"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">€{p.price.toFixed(2)}</td>
                    <td className="p-3">{p.stock ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 overflow-auto max-h-[500px]">
            <h3 className="text-xl font-bold mb-6">Bestellübersicht</h3>
            <table className="w-full table-auto border-collapse text-gray-200">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3">Bestell-ID</th>
                  <th className="text-left p-3">Kunde</th>
                  <th className="text-left p-3">Betrag</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Datum</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-700 hover:bg-white/5"
                  >
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.userName ?? o.userId}</td>
                    <td className="p-3">€{o.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          o.status === "Bezahlt"
                            ? "bg-green-600"
                            : o.status === "Versendet"
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(o.date).toLocaleDateString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 overflow-auto max-h-[600px]">
            <h3 className="text-xl font-bold mb-6">Bewertungen Freigabe</h3>

            {reviews.length === 0 ? (
              <p className="text-gray-400">Keine Bewertungen vorhanden.</p>
            ) : (
              <table className="w-full table-auto border-collapse text-gray-200">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-3">Benutzer</th>
                    <th className="text-left p-3">Bewertung</th>
                    <th className="text-left p-3">Kommentar</th>
                    <th className="text-left p-3">Datum</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-center p-3">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr
                      key={r.id}
                      className={`border-b border-gray-700 hover:bg-white/5 ${
                        r.approved ? "bg-green-900/20" : "bg-red-900/20"
                      }`}
                    >
                      <td className="p-3">{r.userName || r.userId || "Unbekannt"}</td>
                      <td className="p-3">
                        <span className="text-yellow-400">
                          {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                        </span>
                      </td>
                      <td
                        className="p-3 max-w-xs truncate"
                        title={r.comment}
                      >
                        {r.comment}
                      </td>
                      <td className="p-3">
                        {r.date?.seconds
                          ? new Date(r.date.seconds * 1000).toLocaleDateString(
                              "de-DE"
                            )
                          : "-"}
                      </td>
                      <td className="p-3 text-center">
                        {r.approved ? (
                          <span className="px-2 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                            Freigegeben
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                            Ausstehend
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        {!r.approved && (
                          <button
                            onClick={() => approveReview(r.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-semibold transition"
                          >
                            Freigeben
                          </button>
                        )}
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-semibold transition"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
