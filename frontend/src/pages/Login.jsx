import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { login } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const { setUser } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login({ email, password });
            console.log(user);
            if(user.success==false){
                setError(user.message);
            }else{
                setUser(user);
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <h2>LOGIN</h2>
            {error && <p className="error">{error}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>

            {/* ✅ Add Signup Link */}
            <p className="signup-link">
                Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;
