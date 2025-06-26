import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { auth, db } from "@/firebase"; // aus deiner firebase.ts korrekt exportiert

// Erweiterter User-Typ für App mit Rollen etc.
export interface User extends FirebaseUser {
  username?: string;
  role?: string;
}

// Kontext-Typ
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Initialer Context-Wert
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

// Custom Hook
export const useAuth = () => useContext(AuthContext);

// Provider-Komponente
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial-Status
  const [isLoading, setIsLoading] = useState(false); // Login/Register Status

// Funktion um User-Daten inkl. Rolle aus Firestore zu laden
const fetchUserData = async (uid: string): Promise<Partial<User>> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as Partial<User>;
    }
  } catch (error) {
    console.error("Fehler beim Laden der User-Daten:", error);
  }
  return {};
};

useEffect(() => {
  // onAuthStateChanged reagiert auf User Login Status Änderungen
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Firestore-Daten holen (inkl. Rolle)
      const extraData = await fetchUserData(firebaseUser.uid);
      // User State mit FirebaseUser + Firestore Daten füllen
      setUser({ ...firebaseUser, ...extraData });
    } else {
      setUser(null);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    // Firestore User-Daten nach Login holen (inkl. Rolle)
    const extraData = await fetchUserData(credentials.user.uid);
    // User State aktualisieren mit Rolle
    setUser({ ...credentials.user, ...extraData });
    return true;
  } catch (error) {
    console.error("Login Fehler:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};

const register = async (username: string, email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Displayname in Firebase Auth setzen
    await updateProfile(user, { displayName: username });

    // Rolle und Username in Firestore setzen (Standard Rolle "user")
    await setDoc(doc(db, "users", user.uid), {
      username,
      role: "user",  // Wichtig: hier Standardrolle speichern
    });

    setUser({ ...user, username, role: "user" });
    return true;
  } catch (error) {
    console.error("Registrierung Fehler:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};


  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Fehler:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
