import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { signup as signupApi } from './apiService';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setEmail(params.get('email') || '');
        setName(params.get('name') || '');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await signupApi({
                email,
                name,
                username,
            });
            localStorage.setItem('thoughtlog_jwt', res.token);
            navigate('/my-page');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ minWidth: 300, padding: 24, border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}>
                <h2>Complete Signup</h2>
                <div style={{ marginBottom: 12 }}>
                    <label>Email:</label>
                    <input type="email" value={email} disabled style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Full Name:</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} required />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%' }} required />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default Signup; 