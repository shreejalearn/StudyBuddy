import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebaseSetup';
import { useAuth } from './AuthContext'; // Import useAuth
import './styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Use the login function from the context

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');  // Clear any previous error messages

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            login(user.accessToken); // Update the context with the token
            localStorage.setItem('userName', email);
            navigate("/homepage");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            if (errorCode === 'auth/invalid-credential') {
                setErrorMessage('Invalid credentials. Please try again.');
            } else {
                setErrorMessage(errorMessage);
            }
        }
    };

    return (
        <main className="login-main">
            <section className="login-section">
                <div className="login-container">
                    <div className="login-content">
                        <h1>Log In</h1>
                        <form className="login-form" onSubmit={onSubmit}>
                            <div className="input-group">
                                <label htmlFor="email-address">Email address</label>
                                <input
                                    type="email"
                                    id="email-address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                            </div>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit">Log in</button>
                        </form>
                        <p>
                            Don't have an account?{' '}
                            <NavLink to="/signup">Sign up</NavLink>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;
