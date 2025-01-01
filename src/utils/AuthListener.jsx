import React, {useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from '../store';
import { app } from "../config/firebase";
import { useNavigate } from 'react-router-dom';

const AuthListener = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useStore(state => state.setUser);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  return isLoading ? null : children; // Only return children when loading is finished
};

export default AuthListener;