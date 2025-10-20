import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(null); // ✅ Nuevo estado global para los datos del usuario
  const [userUpdated, setUserUpdated] = useState(false);

  // Cargar usuario al iniciar si hay token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUser();
  }, []);

  // Escuchar cambios de login/logout en localStorage
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("jwtToken"));
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // ✅ Función para actualizar datos del usuario globalmente
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    setUserUpdated(prev => !prev); // 👈 alterna para disparar el re-render global
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, updateUser, userUpdated }}>
      {children}
    </AuthContext.Provider>
  );
};
