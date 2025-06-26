import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";

const roles = ["admin", "user", "moderator"]; // Beispiel-Rollen

const AdminManagementPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // State für Daten
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // Formulare
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", status: "aktiv" });
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, stock: 0 });

  // Edit State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // --- INITIALISIERUNG DER COLLECTIONS BEI LEEREM ZUSTAND ---
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const initializeData = async () => {
      try {
        // Prüfe users Collection auf Einträge
        const usersSnapshot = await getDocs(collection(db, "users"));
        if (usersSnapshot.empty) {
          await addDoc(collection(db, "users"), {
            name: "Admin",
            email: "admin@example.com",
            role: "admin",
            status: "aktiv",
            createdAt: Timestamp.now(),
          });
          await addDoc(collection(db, "users"), {
            name: "Test User",
            email: "user@example.com",
            role: "user",
            status: "aktiv",
            createdAt: Timestamp.now(),
          });
        }

        // Prüfe products Collection auf Einträge
        const productsSnapshot = await getDocs(collection(db, "products"));
        if (productsSnapshot.empty) {
          await addDoc(collection(db, "products"), {
            name: "Test Hoodie",
            price: 49.99,
            stock: 10,
            description: "Ein cooler Hoodie",
            createdAt: Timestamp.now(),
          });
          await addDoc(collection(db, "products"), {
            name: "T-Shirt",
            price: 19.99,
            stock: 25,
            description: "Bequemes T-Shirt",
            createdAt: Timestamp.now(),
          });
        }
      } catch (error) {
        console.error("Initialisierung fehlgeschlagen:", error);
      }
    };

    initializeData();
  }, [user]);

  // Echtzeit Listener für Nutzer
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubUsers();
  }, [user]);

  // Echtzeit Listener für Produkte
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubProducts();
  }, [user]);

  // Neue Nutzer hinzufügen
  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Name und E-Mail sind erforderlich");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        ...newUser,
        status: newUser.status || "aktiv",
        createdAt: Timestamp.now(),
      });
      setNewUser({ name: "", email: "", role: "user", status: "aktiv" });
    } catch (error: any) {
      alert("Fehler beim Hinzufügen des Nutzers: " + error.message);
    }
  };

  // Nutzer aktualisieren
  const handleUpdateUser = async (id: string, updatedUser: any) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, updatedUser);
      setEditingUserId(null);
    } catch (error: any) {
      alert("Fehler beim Aktualisieren: " + error.message);
    }
  };

  // Nutzer löschen
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Nutzer wirklich löschen?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (error: any) {
      alert("Fehler beim Löschen: " + error.message);
    }
  };

  // Neue Produkte hinzufügen
  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || newProduct.price <= 0) {
      alert("Name und Preis sind erforderlich");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        createdAt: Timestamp.now(),
      });
      setNewProduct({ name: "", price: 0, stock: 0 });
    } catch (error: any) {
      alert("Fehler beim Hinzufügen des Produkts: " + error.message);
    }
  };

  // Produkt aktualisieren
  const handleUpdateProduct = async (id: string, updatedProduct: any) => {
    try {
      const prodRef = doc(db, "products", id);
      await updateDoc(prodRef, updatedProduct);
      setEditingProductId(null);
    } catch (error: any) {
      alert("Fehler beim Aktualisieren: " + error.message);
    }
  };

  // Produkt löschen
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Produkt wirklich löschen?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error: any) {
      alert("Fehler beim Löschen: " + error.message);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl font-semibold">Kein Zugriff. Bitte als Admin anmelden.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl font-semibold animate-pulse">Lade Daten...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-7xl mx-auto font-['Nunito']">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
        Admin Verwaltung
      </h1>

      {/* Nutzerverwaltung */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Nutzer verwalten</h2>

        {/* Neuen Nutzer anlegen */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
            className="p-3 rounded text-black flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={newUser.email}
            onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
            className="p-3 rounded text-black flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
            className="p-3 rounded text-black w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddUser}
            className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded font-semibold shadow-lg"
          >
            Nutzer hinzufügen
          </button>
        </div>

        {/* Nutzerliste */}
        <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
          <table className="w-full table-auto text-left min-w-[700px]">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 font-medium text-gray-300">Name</th>
                <th className="p-4 font-medium text-gray-300">E-Mail</th>
                <th className="p-4 font-medium text-gray-300">Rolle</th>
                <th className="p-4 font-medium text-gray-300">Status</th>
                <th className="p-4 font-medium text-gray-300">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                editingUserId === u.id ? (
                  <tr key={u.id} className="bg-gray-700 hover:bg-gray-600 transition">
                    <td className="p-3">
                      <input
                        type="text"
                        defaultValue={u.name}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((user) =>
                              user.id === u.id ? { ...user, name: e.target.value } : user
                            )
                          )
                        }
                        className="p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="email"
                        defaultValue={u.email}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((user) =>
                              user.id === u.id ? { ...user, email: e.target.value } : user
                            )
                          )
                        }
                        className="p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        defaultValue={u.role}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((user) =>
                              user.id === u.id ? { ...user, role: e.target.value } : user
                            )
                          )
                        }
                        className="p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          u.status === "aktiv" ? "bg-green-600" : "bg-gray-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateUser(u.id, {
                            name: u.name,
                            email: u.email,
                            role: u.role,
                            status: u.status,
                          })
                        }
                        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-1 rounded text-sm"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-gray-600 hover:bg-gray-700 transition px-4 py-1 rounded text-sm"
                      >
                        Abbrechen
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-700 transition cursor-pointer"
                    onDoubleClick={() => setEditingUserId(u.id)}
                  >
                    <td className="p-4">{u.name}</td>
                    <td className="p-4 text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          u.role === "admin" ? "bg-red-600" : "bg-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          u.status === "aktiv" ? "bg-green-600" : "bg-gray-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => setEditingUserId(u.id)}
                        className="text-purple-400 hover:text-purple-300 transition"
                        title="Bearbeiten"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Löschen"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Produktverwaltung */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Produkte verwalten</h2>

        {/* Neues Produkt anlegen */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Produktname"
            value={newProduct.name}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
            className="p-3 rounded text-black flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Preis"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
            }
            className="p-3 rounded text-black w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Lagerbestand"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))
            }
            className="p-3 rounded text-black w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded font-semibold shadow-lg"
          >
            Produkt hinzufügen
          </button>
        </div>

        {/* Produktliste */}
        <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-lg">
          <table className="w-full table-auto text-left min-w-[700px]">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 font-medium text-gray-300">Name</th>
                <th className="p-4 font-medium text-gray-300">Preis (€)</th>
                <th className="p-4 font-medium text-gray-300">Lagerbestand</th>
                <th className="p-4 font-medium text-gray-300">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) =>
                editingProductId === p.id ? (
                  <tr key={p.id} className="bg-gray-700 hover:bg-gray-600 transition">
                    <td className="p-3">
                      <input
                        type="text"
                        defaultValue={p.name}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, name: e.target.value } : prod
                            )
                          )
                        }
                        className="p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={p.price}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id
                                ? { ...prod, price: parseFloat(e.target.value) || 0 }
                                : prod
                            )
                          )
                        }
                        className="p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={p.stock}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, stock: parseInt(e.target.value) || 0 } : prod
                            )
                          )
                        }
                        className="p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                      />
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateProduct(p.id, {
                            name: p.name,
                            price: p.price,
                            stock: p.stock,
                          })
                        }
                        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-1 rounded text-sm"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="bg-gray-600 hover:bg-gray-700 transition px-4 py-1 rounded text-sm"
                      >
                        Abbrechen
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-700 transition cursor-pointer"
                    onDoubleClick={() => setEditingProductId(p.id)}
                  >
                    <td className="p-4">{p.name}</td>
                    <td className="p-4">€{p.price.toFixed(2)}</td>
                    <td className="p-4">{p.stock ?? "-"}</td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => setEditingProductId(p.id)}
                        className="text-purple-400 hover:text-purple-300 transition"
                        title="Bearbeiten"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Löschen"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminManagementPage;
