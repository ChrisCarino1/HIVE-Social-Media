import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios'
import React, {useState} from 'react';
import loginreg from './css/loginreg.module.css'

const Registration = (props) => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [userReg, setUserReg] = useState({
        username:'',
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const onChangeHandler = (e) => {
        setUserReg({...userReg, [e.target.name]: e.target.value})
    }

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/register', userReg, {withCredentials:true})
            .then((res) => {
                console.log(res);
                window.localStorage.setItem('uuid', res.data.user._id)
                navigate('/dashboard')
            })
            .catch((err) => {
                console.log(err);
                if(!err.response.data.verified){
                    console.log("ERROR HERE")
                    setErrors(err.response.data.error.errors)
                }
            })
    }

    return (
        <body class={loginreg.bodyLogin}>
            <div class={loginreg.container}>
            <div class={loginreg.forms}>
                <div class={loginreg.formLogin}>

                    <form onSubmit={submitHandler}>
                    <span class={loginreg.title}>Register</span>
                        <div class={loginreg.inputField}>
                            <input className={loginreg.input} type="text"  name="username" placeholder="  Enter your username" onChange={onChangeHandler} value={userReg.username}/>
                        </div>
                        {
                            errors.username?
                            <p class={loginreg.error}>{errors.username.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input className={loginreg.input} type="text" name="firstName" placeholder="  Enter your first name" onChange={onChangeHandler} value={userReg.firstName}/>
                        </div>
                        {
                            errors.firstName?
                            <p class={loginreg.error}>{errors.firstName.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input className={loginreg.input} type="text" name="lastName" placeholder="  Enter your last name" onChange={onChangeHandler} value={userReg.lastName}/>
                        </div>
                        {
                            errors.lastName?
                            <p class={loginreg.error}>{errors.lastName.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input className={loginreg.input} type="text" name="email" placeholder="  Enter your email" onChange={onChangeHandler} value={userReg.email}/>
                        </div>
                        {
                            errors.email?
                            <p class={loginreg.error}>{errors.email.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input className={loginreg.input} type="password" name="password" placeholder="  Enter your password" onChange={onChangeHandler} value={userReg.password}/>
                        </div>
                        {
                            errors.password?
                            <p class={loginreg.error}>{errors.password.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input className={loginreg.input} type="password" name="confirmPassword" placeholder="  Enter your password" onChange={onChangeHandler} value={userReg.confirmPassword}/>
                        </div>
                        {
                            errors.confirmPassword?
                            <p class={loginreg.error}>{errors.confirmPassword.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input className={loginreg.submitBtn} type="submit" class={loginreg.button} value="Sign up"/>
                        </div>
                
                    </form>

                        <div class={loginreg.loginSignup}>
                            <span class="text">Already a member? </span>
                            <a href='/login' to={'/login'}>Login now</a>
                        </div>
                </div>
            </div>
        </div>
        </body>
)}

export default Registration;