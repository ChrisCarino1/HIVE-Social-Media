import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, useNavigate, useParams} from 'react-router-dom';
import main from './css/main.module.css'
import Nav from './Nav';
import RightColumn from './RightColumn';

const Profile = (props) => {
    const {allPosts, setAllPosts, allUsers, setAllUsers, loggedInUser, setLoggedInUser, loggedInUserID, socket} = props
    const navigate = useNavigate()
    const id = window.localStorage.getItem('uuid')
    const [user, setUser] = useState({})
    const [image, setImage] = useState('')
    const [updatedUsername, setUpdatedUsername] = useState()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/loggedInUser/${id}`)
            .then((res) => {
                setUser(res.data.oneUser)
            })
            .catch((err) => {
                console.log("Failed to connect to route")
                console.log(err);
            })
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/api/updateUser/${id}`, {image, updatedUsername})
            .then(() => {
                navigate('/profile')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleInputChange = (e) => {
        setUpdatedUsername({...setUpdatedUsername, [e.target.name]: e.target.value})
    }

    const fileSelectedHandler = (event) => {
        const file = event.target.files[0]
        const data = new FormData()
        data.append('file', file)
        data.append("upload_preset", "Hive_Media")
        axios.post('https://api.cloudinary.com/v1_1/disq3dfbj/image/upload', data)
        .then(res => {
            console.log(res)
            setImage(res.data.secure_url)
        })
        .catch(err => console.log(err))

    }

    const logout = () => {
        axios.post('http://localhost:8000/api/logout', {} , {withCredentials:true})
            .then((res) => {
                console.log(res);
                window.localStorage.removeItem('uuid')
                navigate('/login')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className={main.row}>
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"/>
            <div className={main.column}>
                <Nav/>
            </div>
            <div className={main.column}>
                <div className={main.topContent}>
                    <div>
                        <span className={main.pageTitleText}>Profile Page</span>
                    </div>
                </div>
                <div className={main.bottomContent}>
                    <div className={main.container}>
                        <div className={main.containerHeading}>
                            <div className={main.usernameWithProfilePicture}>
                                <img src={user.image} class={main.profilePicture}/>
                                <h6 className={main.profilePageUsername} >{user.username}</h6>
                            </div>
                        </div>
                        <div className={main.containerContent}>
                            <form onSubmit={submitHandler}>
                                <div className={main.profilePageInputGroup}>
                                    <div className={main.profilePageLabels}>
                                        <label for="username" class={main.inputLabel}>Username</label>
                                        <label for={main.chooseFile} class={main.inputLabel}>Picture</label>
                                    </div>
                                    <div className={main.profilePageInputs}>
                                        <input type="text" name="username" onChange={handleInputChange} class={main.input} placeholder={user.username}/>
                                        <input type="file" class={main.input} id={main.chooseFile} onChange={fileSelectedHandler} name="image" className={main.input} placeholder='Upload Image' />
                                    </div>
                                </div>
                                <div className={main.profilePageImageDiv}>
                                </div>
                                <div className={main.profilePageSubmitDiv}>
                                    <button type="submit" class={main.chatSendBtn}>Apply Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className={main.column}>
                <RightColumn/>
            </div>
        </div>
    )
}

export default Profile;