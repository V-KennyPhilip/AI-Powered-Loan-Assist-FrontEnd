import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  // Define fetchUser in the component's scope.
  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user', { 
        headers: {
          Accept: 'application/json'
        },
        credentials: 'include' // Send the httpOnly cookie.
      });
      if (response.ok) {
        const json = await response.json();
        setUserDetails({
          id: json.data.userId,
          role: json.data.role,
        });
      } else {
        console.error('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Call fetchUser on component mount.
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, fetchUser, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
