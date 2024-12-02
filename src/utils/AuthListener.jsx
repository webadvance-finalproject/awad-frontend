import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from '../store';
import { app } from "../config/firebase";
import { useNavigate } from 'react-router-dom';

const AuthListener = () => {
  const setUser = useStore(state => state.setUser);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        console.log("not signed in");
        setUser(null);
        navigate('/login'); // Navigate to login if not signed in
      }
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, [auth, setUser]);

  return null; // This component does not render anything
};

export default AuthListener;