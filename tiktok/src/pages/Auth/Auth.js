import React, { useState } from 'react';
import request from '../../api/request';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom'; 
import './Auth.css';

function Auth() {
    const [activePanel, setActivePanel] = useState("container");

    const { 
        resetField: resetSignup,
        register: registerSignup, 
        handleSubmit: handleSignup,  
        formState: { errors: errorsSignup } } = useForm(
            {
                defaultValues: {
                    usernameSignup: '',
                    passwordSignup: '',
                },
                mode: 'onChange'
            },
        );

    const { 
        resetField: resetSignin,
        register: registerSignin, 
        handleSubmit: handleSignin, 
        formState: { errors: errorsSignin } } = useForm(
            {
                defaultValues: {
                    usernameSignin: '',
                    passwordSignin: '',
                },
                mode: 'onChange'
            },
        );

    const { login } = useAuth();       
    const [searchParams] = useSearchParams();

    const onSubmitSignin = async (values) => {
        const { usernameSignin, passwordSignin } = values;
        try {
            const res = await request({
                url: '/api/auth/login',
                method: 'post',
                data: {
                    username: usernameSignin,
                    password: passwordSignin,
                }
            })
            if (res.data.success) {
                login({
                    _id: res.data.data._id,
                    token: res.data.data.token,
                    returnUrl: searchParams.get('returnUrl') ?? ''
                })
            }
        } catch (err) {
            resetSignin();
            alert(err.response.data.message);
        }
    };

    const onSubmitSignup = async (values) => {
        const { usernameSignup, passwordSignup } = values;
        try {
            const res = await request({
                url: '/api/auth/signup',
                method: 'POST',
                data: {
                    username: usernameSignup,
                    password: passwordSignup,
                }
            });
            if (res.data.success) {
                resetSignup();
                setActivePanel("container");
            }
        } catch (err) {
            resetSignup();
            alert(err.response.data.message);
        }
    };

    return (
        <div className="auth__container">
            <div className={activePanel}>
                <div className="form-container sign-up-container">
                    <form className="auth__form"
                        onSubmit={handleSignup(onSubmitSignup)}
                    >
                        <h1 className="form-title">Create Account</h1>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="form-input"
                            {...registerSignup('usernameSignup', { required: true })}
                        />
                        {errorsSignup?.usernameSignup?.type === 'required' && <p>Username required</p>}
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="form-input"
                            {...registerSignup('passwordSignup', { required: true, minLength: 6})}
                        />
                        {errorsSignup?.passwordSignup?.type === 'required' && <p>Password required</p>}
                        {errorsSignup?.passwordSignup?.type === 'minLength' && <p>Password must be at least 6 charactersrequired</p>}
                        <button type="submit" className="btn">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form className="auth__form"
                        onSubmit={handleSignin(onSubmitSignin)}
                    >
                        <h1 className="form-title">Sign in</h1>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="form-input"
                            {...registerSignin('usernameSignin', { required: true })}
                        />
                        {errorsSignin?.usernameSignin?.type === 'required' && <p>Username required</p>}
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="form-input"
                            {...registerSignin('passwordSignin', { required: true, minLength: 6})}
                        />
                        {errorsSignin?.passwordSignin?.type === 'required' && <p>Password required</p>}
                        {errorsSignin?.passwordSignin?.type === 'minLength' && <p>Password must be at least 6 charactersrequired</p>}
                        <button  type="submit" className="btn">Sign In</button>
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