import { createContext, useContext, useState } from "react"; 
import api from "../api/axios"; 
 
const AuthContext = createContext(null); 
 
export function AuthProvider({ children }) { 
const [user, setUser] = useState( 
JSON.parse(localStorage.getItem("user") || "null") 
); 
const login = async (username, password) => { 
const { data } = await api.post("/api/token/", { username, password }); 
localStorage.setItem("access", data.access); 
localStorage.setItem("refresh", data.refresh); 
const me = await api.get("/api/auth/me/"); 
localStorage.setItem("user", JSON.stringify(me.data)); 
setUser(me.data); 
}; 
const register = async (username, email, password) => { 
await api.post("/api/auth/register/", { username, email, password }); 
await login(username, password); 
}; 
const logout = () => { 
localStorage.clear(); 
setUser(null); 
}; 
return ( 
<AuthContext.Provider value={{ user, login, register, logout }}> 
{children} 
</AuthContext.Provider> 
); 
} 
export const useAuth = () => useContext(AuthContext); 