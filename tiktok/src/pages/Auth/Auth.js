import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Auth.css';

function Auth() {
    const [activePanel, setActivePanel] = useState("container");

    const { 
        register, 
        handleSubmit, 
        formState: { errors } } = useForm(
            {
                defaultValues: {
                    usernameSignup: '',
                    passwordSignup: '',
                    usernameSignin: '',
                    passwordSignin: '',
                },
                mode: 'onChange'
            },
        );

    const navigate = useNavigate();

    const onSubmitSignin = async (values) => {
        console.log(values);
        const { usernameSignin, passwordSignin } = values;
        try {
            const res = await axios({
                url: 'http://localhost:9000/api/auth/login',
                method: 'post',
                data: {
                    username: usernameSignin,
                    password: passwordSignin,
                }
            })
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmitSignup = (values) => {
        
    };

    function usernameSignupRequired() {
        if(activePanel === "container right-panel-active") {
            return {...register('usernameSignup', { required: true })};
        }
        return null;
    }

    function passwordSignupRequired() {
        if(activePanel === "container right-panel-active") {
            return {...register('passwordSignup', { required: true, minLength: 6})};
        }
        return null;
    }

    function usernameSigninRequired() {
        if(activePanel === "container right-panel-active") {
            return {...register('usernameSignin', { required: true })};
        }
        return null;
    }

    function passwordSigninRequired() {
        if(activePanel === "container right-panel-active") {
            return {...register('passwordSignin', { required: true, minLength: 6})};
        }
        return null;
    }

    useEffect(() => {
        usernameSignupRequired();
        passwordSignupRequired();
        usernameSigninRequired();
        passwordSigninRequired();
    }, [activePanel])

    return (
        <div className="auth__container">
            <div className={activePanel}>
                <div className="form-container sign-up-container">
                    <form className="auth__form"
                        onSubmit={handleSubmit(onSubmitSignup)}
                    >
                        <h1 className="form-title">Create Account</h1>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="form-input"
                            {...register('usernameSignup', { required: true })}
                        />
                        {errors?.usernameSignup?.type === 'required' && <p>Username required</p>}
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="form-input"
                            {...register('passwordSignup', { required: true, minLength: 6})}
                        />
                        {errors?.passwordSignup?.type === 'required' && <p>Password required</p>}
                        {errors?.passwordSignup?.type === 'minLength' && <p>Password must be at least 6 charactersrequired</p>}
                        <button type="submit" className="btn">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form className="auth__form"
                        onSubmit={handleSubmit(onSubmitSignin)}
                    >
                        <h1 className="form-title">Sign in</h1>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="form-input"
                            {...register('usernameSignin', { required: true })}
                        />
                        {errors?.usernameSignin?.type === 'required' && <p>Username required</p>}
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="form-input"
                            {...register('passwordSignin', { required: true, minLength: 6})}
                        />
                        {errors?.passwordSignin?.type === 'required' && <p>Password required</p>}
                        {errors?.passwordSignin?.type === 'minLength' && <p>Password must be at least 6 charactersrequired</p>}
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