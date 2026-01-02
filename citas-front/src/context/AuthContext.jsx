import { createContext, useContext } from "react";

// 👉 Creamos el contexto
export const AuthContext = createContext(null);

// 👉 Hook para usar el contexto en cualquier componente
export function useAuth() {
  return useContext(AuthContext);
}
