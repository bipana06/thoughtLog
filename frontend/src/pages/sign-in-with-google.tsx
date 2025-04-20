import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignInWithGoogle: React.FC = () => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        // After successful sign-in, redirect to the my-posts page
        navigate('/my-page');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button onClick={handleSignIn} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                Sign in with Google
            </button>
        </div>
    );
};

export default SignInWithGoogle;