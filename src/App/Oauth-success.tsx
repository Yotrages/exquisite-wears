'use client'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setAuthToken } from '../utils/cookieManager';
import { oauthLoginSuccess } from '../redux/authSlice';

const OAuthSuccess = () => {
  const router = useNavigate();
  const dispatch = useDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true;

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const name = queryParams.get('name');
    const email = queryParams.get('email');
    const userId = queryParams.get('_id');
    const isAdmin = queryParams.get('isAdmin') === 'true';

    console.log('Received OAuth token:', { userId, name, email, isAdmin });

    if (token && name && email && userId) {
      try {
        // Store token securely using cookieManager
        setAuthToken(token);
        
        // Dispatch Redux action to update auth state
        dispatch(oauthLoginSuccess({
          token,
          user: {
            _id: userId,
            name,
            email,
            isAdmin,
          },
        }));
        
        toast.success('OAuth login successful!');
        router('/');
      } catch (error) {
        console.error('Failed to process OAuth login:', error);
        toast.error('Failed to process OAuth login');
        router(`/login?error=${encodeURIComponent("Failed to process OAuth login")}`);
      }
    } else {
      console.error('OAuth data missing from URL');
      toast.error('OAuth data missing from URL');
      router(`/login?error=${encodeURIComponent("OAuth data missing from URL")}`);
    }
  }, [router, dispatch]);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
