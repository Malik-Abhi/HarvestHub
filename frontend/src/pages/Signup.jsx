import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { signup } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const { setUser } = useStore();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signup({ username, email, password });

            if (response && response.success == false) {
                setError(response?.message);
                setSuccess('');
                return;
            }

            setUser(response.user || response);
            setSuccess('Signup successful! Redirecting...');
            setError('');

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.message);
            setSuccess('');
        }
    };


    return (
        <div className="signup-container">
            <h2>SIGN UP</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form className="auth-form"  onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>

            <p className="login-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
