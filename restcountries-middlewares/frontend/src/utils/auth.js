// src/utils/auth.js
export const saveAuth = (token) => {
    localStorage.setItem("token", token);
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };
  
  export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };
  