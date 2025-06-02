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
<div className="flex flex-col items-center justify-center min-h-screen px-4 text-black">
    <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-200 space-y-8"
    >
        <h2 className="text-3xl font-semibold text-center text-purple-700">New User Signup</h2>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email</label>
            <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Full Name*</label>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Username*</label>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>

        {error && (
            <div className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg">
                {error}
            </div>
        )}

        <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white transition duration-200 ${
                loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
        >
            {loading ? 'Signing up...' : 'Sign Up'}
        </button>
    </form>
</div>


    );
};

export default Signup; 