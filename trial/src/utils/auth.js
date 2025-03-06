// src/utils/auth.js
// This file would contain more robust authentication functionality in a real app

export const checkIfUserExists = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
  };
  
  export const validateUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email && user.password === password);
  };
  
  export const createUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };
  
  export const logout = () => {
    localStorage.removeItem('isLoggedIn');
    // In a real app, you might clear tokens, cookies, etc.
  };