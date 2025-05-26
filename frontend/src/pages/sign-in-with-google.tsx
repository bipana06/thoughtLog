import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { googleSignIn } from './apiService';

const SignInWithGoogle: React.FC = () => {
    const navigate = useNavigate();
    // Handle redirect from backend with JWT token
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('thoughtlog_jwt', token);
            navigate('/my-page');
        }
    }, [navigate]);

    const handleGoogleSignIn = () => {
        googleSignIn();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button onClick={handleGoogleSignIn} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                Sign in with Google
            </button>
        </div>
    );
};

export default SignInWithGoogle;