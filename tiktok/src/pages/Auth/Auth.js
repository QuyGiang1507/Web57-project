import React, { useState } from 'react';
import './Auth.css';

function Auth() {
    const [activePanel, setActivePanel] = useState("container");

    return (
        <div className="auth__container">
            <div className={activePanel}>
                <div className="form-container sign-up-container">
                    <form action="#" className="auth__form">
                        <h1 className="form-title">Create Account</h1>
                        <input type="text" placeholder="Username" className="form-input"/>
                        <input type="password" placeholder="Password" className="form-input"/>
                        <button  className="btn">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form action="#" className="auth__form">
                        <h1 className="form-title">Sign in</h1>
                        <input type="text" placeholder="Username" className="form-input"/>
                        <input type="password" placeholder="Password" className="form-input"/>
                        <button className="btn">Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="form-title">Welcome Back!</h1>
                            <p className="form-description">To keep connected with us please login with your personal info</p>
                            <button 
                                className="btn ghost" 
                                onClick={e => setActivePanel("container")}
                            >Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1 className="form-title">Hello, Friend!</h1>
                            <p  className="form-description">Enter your personal details and start journey with us</p>
                            <button 
                                className="btn ghost" 
                                onClick={e => setActivePanel("container right-panel-active")}
                            >Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth