'use client'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const router = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true;

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const name = queryParams.get('name');
    const isAdmin = queryParams.get('isAdmin');

    console.log('Received:', { token, name, isAdmin });

    if (token && name && isAdmin) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("admin", isAdmin);
      router('/')
    } else {
      console.error('OAuth data missing from URL');
      router(`/login?error=${encodeURIComponent("OAuth data missing from URL")}`);
    }
  }, [router]);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
