// src/services/authService.js
import { DEMO_USERS } from './DemoLogin';

export const mockLogin = (email, password) => {
 
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem("userRole", user.role.toLowerCase());
    return { success: true, role: user.role.toLowerCase() };
  }
  return { success: false, message: "Invalid credentials" };
};