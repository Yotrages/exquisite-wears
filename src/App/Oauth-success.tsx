'use client'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setAuthToken } from '../utils/cookieManager';
import { oauthLoginSuccess } from '../redux/authSlice';
import apiClient from '../Api/axiosConfig';

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
    const userId = queryParams.get('id');  // Fixed: backend sends 'id', not '_id'
    const isAdmin = queryParams.get('isAdmin') === 'true';

    console.log('Received OAuth token:', { userId, name, isAdmin });

    if (token && name && userId !== null) {
      try {
        // Store token securely using cookieManager
        setAuthToken(token);

        // Fetch user profile data using the token
        apiClient.get(`/users/profile`).then((res) => {
          const userData = res.data;

          // Dispatch Redux action to update auth state with complete user data
          dispatch(oauthLoginSuccess({
            token,
            user: {
              _id: userData._id || userId,
              email: userData.email,
              name: userData.name || name,
              isAdmin: userData.isAdmin !== undefined ? userData.isAdmin : isAdmin,
            },
          }));

          toast.success('OAuth login successful!');
          router('/');
        }).catch((apiError) => {
          console.error('Failed to fetch user profile:', apiError);
          // Fallback to using URL data if API call fails
          dispatch(oauthLoginSuccess({
            token,
            user: {
              _id: userId,
              name,
              email: '', // Email will need to be updated later or fetched separately
              isAdmin,
            },
          }));

          toast.success('OAuth login successful! (Fetching profile data...)');
          router('/');
        });
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
