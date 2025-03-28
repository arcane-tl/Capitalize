import React, { createContext, useContext, useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  console.log('Accessing UserContext:', context);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};