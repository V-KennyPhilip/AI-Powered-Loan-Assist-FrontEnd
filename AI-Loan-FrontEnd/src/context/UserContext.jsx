// /src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch the current user's details on mount.
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('http://localhost:8080/api/user', { 
          headers: {
            Accept: 'application/json'
          },
          credentials: 'include' // Send the httpOnly cookie.
        });
        if (response.ok) {
          const json = await response.json();
          // Expecting json.data to be an object containing userId and roles.
          setUser(json.data);
        } else {
          console.error('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};