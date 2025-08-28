import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { signup, login } from '../utils/api';

const AuthForm = () => {
    const { setUser } = useStore();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const user = await login(formData);
                setUser(user);
            } else {
                const user = await signup(formData);
                setUser(user);
            }
            setFormData({ username: '', email: '', password: '' });
            setError('');
        } catch (err) {
            setError(err.response.data.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                {error && <p>{error}</p>}
            </form>
            <button onClick={() => setIsLogin((prev) => !prev)}>
                Switch to {isLogin ? 'Sign Up' : 'Login'}
            </button>
        </div>
    );
};

export default AuthForm;