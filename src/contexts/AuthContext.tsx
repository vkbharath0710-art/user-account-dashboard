"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  idNumber: string;
  phoneNumber: string;
  role?: 'user' | 'admin';
}

interface Admin {
  id: string;
  username: string;
  role: 'admin';
}

interface PendingUser {
  idNumber: string;
  phoneNumber: string;
  password: string;
  otp: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  login: (idNumber: string, password: string) => Promise<boolean>;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  register: (idNumber: string, phoneNumber: string, password: string) => Promise<boolean>;
  sendOTP: (idNumber: string, phoneNumber: string, password: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  logoutAdmin: () => void;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAdminAuthenticated(true);
    }

    // Initialize admin account if not exists
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    if (admins.length === 0) {
      const defaultAdmin = {
        id: 'admin1',
        username: 'admin',
        password: 'admin123', // Default password
        role: 'admin'
      };
      localStorage.setItem('admins', JSON.stringify([defaultAdmin]));
    }
  }, []);

  const sendOTP = async (idNumber: string, phoneNumber: string, password: string): Promise<{ success: boolean; otp?: string; error?: string }> => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.idNumber === idNumber || u.phoneNumber === phoneNumber);
      if (existingUser) {
        return { success: false, error: "User with this ID or phone number already exists" };
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store pending user with OTP (expires in 5 minutes)
      const pendingUser: PendingUser = {
        idNumber,
        phoneNumber,
        password,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      };

      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      // Remove any existing pending registration for this phone number
      const filteredPending = pendingUsers.filter((u: PendingUser) => u.phoneNumber !== phoneNumber);
      filteredPending.push(pendingUser);
      localStorage.setItem('pendingUsers', JSON.stringify(filteredPending));

      // In production, send OTP via SMS service
      // For demo, we return the OTP to display it
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      
      return { success: true, otp };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: "Failed to send OTP" };
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      const pendingUser = pendingUsers.find((u: PendingUser) => u.phoneNumber === phoneNumber);

      if (!pendingUser) {
        return { success: false, error: "No pending registration found" };
      }

      // Check if OTP expired
      if (Date.now() > pendingUser.expiresAt) {
        return { success: false, error: "OTP has expired. Please request a new one." };
      }

      // Verify OTP
      if (pendingUser.otp !== otp) {
        return { success: false, error: "Invalid OTP. Please try again." };
      }

      // OTP is valid, create the user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = {
        id: Date.now().toString(),
        idNumber: pendingUser.idNumber,
        phoneNumber: pendingUser.phoneNumber,
        password: pendingUser.password,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Remove from pending users
      const filteredPending = pendingUsers.filter((u: PendingUser) => u.phoneNumber !== phoneNumber);
      localStorage.setItem('pendingUsers', JSON.stringify(filteredPending));

      return { success: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: "Failed to verify OTP" };
    }
  };

  const register = async (idNumber: string, phoneNumber: string, password: string): Promise<boolean> => {
    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.idNumber === idNumber || u.phoneNumber === phoneNumber);
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        idNumber,
        phoneNumber,
        password, // In production, this should be hashed
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (idNumber: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.idNumber === idNumber && u.password === password);
      
      if (user) {
        const userData = {
          id: user.id,
          idNumber: user.idNumber,
          phoneNumber: user.phoneNumber,
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const adminUser = admins.find((a: any) => a.username === username && a.password === password);
      
      if (adminUser) {
        const adminData = {
          id: adminUser.id,
          username: adminUser.username,
          role: 'admin' as const,
        };
        setAdmin(adminData);
        setIsAdminAuthenticated(true);
        localStorage.setItem('admin', JSON.stringify(adminData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin,
      login, 
      loginAdmin,
      register, 
      sendOTP, 
      verifyOTP, 
      logout,
      logoutAdmin,
      isAuthenticated,
      isAdminAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}