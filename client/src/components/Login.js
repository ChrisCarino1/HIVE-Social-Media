import { Link, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios'
import React, {useState, useContext} from 'react';
import { UserContext } from '../context/UserContext';
import loginreg from './css/loginreg.module.css'

const Login = (props) => {
    const {loggedInUser, setLoggedInUser} = useContext(UserContext)
    const path = useLocation().pathname;
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const [userLogin, setUserLogin] = useState({
        email:'',
        password:'' 
    })

    const onChangeHandler = (e) => {
        setUserLogin({...userLogin, [e.target.name]: e.target.value})
    }

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/login', userLogin, {withCredentials:true})
            .then((res) => {
                setLoggedInUser(res.data.user)
                console.log("LOGGED IN USER:", loggedInUser)
                window.localStorage.setItem('uuid', res.data.user._id)
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                navigate('/dashboard')
            })
            .catch((err) => {
                console.log(err);
                setErrors(err.response.data)
            })
    }

    return (
        <body class={loginreg.bodyLogin}>
            <div class={loginreg.container}>
            <div class={loginreg.forms}>
                <div class={loginreg.formLogin}>

                    <form onSubmit={submitHandler}>
                    <span class={loginreg.title}>Login</span>
                        <div class={loginreg.inputField}>
                            <input type="text" placeholder="Enter your email" name="email" onChange={onChangeHandler} value={userLogin.email}/>
                        </div>
                        <div class={loginreg.inputField}>
                            <input type="password" placeholder="Enter your password" name="password" onChange={onChangeHandler} value={userLogin.password}/>
                        </div>
                        {
                            errors.message?
                            <p class={loginreg.error}>{errors.message}</p>:null
                        }
                        <div class={loginreg.inputField}>
                            <input type="submit" class={loginreg.button} value="Login Now"/>
                        </div>
                        
                    </form>

                        <div class={loginreg.loginSignup}>
                            <span class="text">Not a member? </span>
                            <a href='/' to={'/'}>Sign up now</a>
                        </div>
                </div>
            </div>
        </div>
        </body>
)}

export default Login;