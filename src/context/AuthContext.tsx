import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
    user: string | null;
    token: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children : ReactNode }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = (username: string, token: string) => {
        setUser(username);
        setToken(token);
        localStorage.setItem("user", username);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value = {{ user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx){
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return ctx;
}
