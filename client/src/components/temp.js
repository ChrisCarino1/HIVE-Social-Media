import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import main from './css/main.module.css'
import { ChatState } from '../context/ChatProvider';
import GroupChat from './GroupChat';

const MessageList = (props) => {
    const {allUsers, setAllUsers, username, setUsername, loggedInUser, setLoggedInUser, socket} = props
    const [user, setUser] = useState({})
    const [userFollowers, setUserFollowers] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [chats, setChats] = useState([])
    const id = window.localStorage.getItem('uuid')
    const navigate = useNavigate()

    // socket.on('new-user-joined', data => {
    //     console.log("Data:", data)
    // })

    socket.on('send-message-to-all-clients', data => {
        // console.log(data)
        setMessages([...messages, data])
    })

    useEffect(() => {
        axios.get(`http://localhost:8000/api/loggedInUser/${id}`)
        .then((res) => {
            setUser(res.data.oneUser)
            console.log(props)
        })
        .catch((err) => {
            console.log("Failed to connect to route here")
            console.log(err)
            // navigate('/dashboard')
        })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8000/api/allUsers')
        .then((allUsers) => {
            console.log(allUsers)
            setAllUsers(allUsers.data)
        })
        .catch((err) => {
            console.log(err)
            setAllUsers([])
            navigate('/')
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/getUserFollowers/${id}`)
        .then((res) => {
            setUserFollowers(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/chats`, { withCredentials: true })
        .then((res) => {
            setChats(res.data); 
            console.log("res:", res)
            console.log("chats:", chats)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        console.log("fetchMessages: ", fetchMessages())
    }, [selectedChat])

    const findUser= (id) => {
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i]._id === id){
                return allUsers[i]
            }
        }
    }

    const findFollowers = (e) => {
        const followingUsers = []

        userFollowers.map((following) => {
            if(following.followed_user_id === e){
                followingUsers.push(following)
            }
        })
        return followingUsers
    }

    const joinServer = (e) => {
        e.preventDefault()
        socket.emit('join-server', loggedInUser.username)
        }

    const findUserProfilePicture= (id) => {
            for(let i = 0; i < allUsers.length; i++){
                if(allUsers[i]._id == id){
                    return allUsers[i].image
                }
            }
        }

    const accessChat = async (userId) => {
        try {
            const { data } = await axios.post(`http://localhost:8000/api/users/chats`, { userId }, { withCredentials: true })
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            console.log("accessChat data:", data)
            setSelectedChat(data);
            console.log("chats", chats)
            } catch (err) {
                console.log(err)
            }
    }

    const fetchMessages = async () => {
        if (!selectedChat) {
            console.log("No selected chat")
            return
        }

        else{
            console.log("selectedChat:", selectedChat)
            try {
                const { data } = await axios.get(
                    `http://localhost:8000/api/messages/${selectedChat._id}`,
                    { withCredentials: true }
                    );
                    console.log("selected user id:",selectedChat._id)
                    setMessages(data);
                    console.log("messages:", messages)
            } catch (err) {
                console.log(err)
            }
        }
        };
    
    // const sendMessage = (e) => {
    //     e.preventDefault()
    //     // console.log("message", messages)
    //     socket.emit("send-message", {message:input, username:loggedInUser.username})
    //     setInput("")
    // }

    const sendMessage = async (e) => {
        e.preventDefault()
        console.log("event key:", e.key)
        // if (e.key === "Enter" && newMessage)
        // socket.emit("stop typing", selectedChat._id);
        try {
            setNewMessage("");
            console.log("newMessage", newMessage)
            console.log("selectedChat ID:", selectedChat._id)
            const { data } = await axios.post(
                "http://localhost:8000/api/messages",
                {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, { withCredentials: true }
                );
                // socket.emit("new message", data);
                setMessages([...messages, data]);
        } catch (err) {
            console.log("ERROR", err)
        }
    };

    return (
        <section className={main.messageList}>
                <div>
                    {
                        chats.map((chat) => ( chat.isGroupChat == true? 
                            <div className={main.messageListUserHeading} onClick={() => {setSelectedChat(chat)}}>
                                {/* <img className={main.profilePicture} src=""/> */}
                                <p className={main.messageListUsername}>{chat.chatName}</p>
                            </div>
                        :
                        <div>
                            {
                                findFollowers(user._id).map((chatUser) => (
                                    <div className={main.messageListTop}key={chatUser._id}>
                                        <form onSubmit={joinServer}>
                                            <button className={main.openChat} onClick={() => {accessChat(chatUser.user_id)}}>
                                                <div className={main.messageListUserHeading}>
                                                    <img className={main.profilePicture} src={findUserProfilePicture(chatUser.user_id)}/>
                                                    <p className={main.messageListUsername}>{findUser(chatUser.user_id).username}</p>
                                                </div>
                                            </button>
                                        </form>
                                                {
                                                    selectedChat?
                                                        <div className={main.chatBox} id={main.chatForm}>
                                                            <form className={main.messageContainer} onSubmit={sendMessage}>
                                                                <div className={main.topMessageContainer}>
                                                                    {
                                                                        messages.map((message) => (
                                                                            <div className={main.messageDiv}>
                                                                                {message.sender._id == id? (<p className={main.loggedUserMessage}>{message.content}</p>):(<p className={main.userMessage}>{message.content}</p>)}
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                                <div className={main.messageInputGroup}>
                                                                    <input className={main.chatInput} name="msg" type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                                                                    <button className={main.chatSendBtn}>Send</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    :null
                                                }
                                        </div>
                                    ))
                            }
                        </div>
                        ))
                    }
                </div>
            <GroupChat allUsers={allUsers} />
        </section>
)}

export default MessageList;


import React, {useState} from 'react'
import axios from 'axios';
import main from './css/main.module.css'

const GroupChat = (props) => {

    const allUsers = props
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isClicked, setIsClicked] = useState(false)
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]); 
    const [loading, setLoading] = useState(false);

        const { user, chats, setChats } = useState({})

        const handleSearch = async (query) => {
            setSearch(query)
            if (!query) {
            return;
        }

        try {
            setLoading(true)
            const { data } = await axios.get(`http://localhost:8000/api/users?search=${search}`,{ withCredentials: true });
            console.log("data:", data)
            setLoading(false)
            setSearchResult(data)
        }catch (err) {
            console.log(err)
        } 
            
        }

        const handleSubmit = async () => {
            if (!groupChatName || !selectedUsers) {
                return;
            }
        
            try {
                const { data } = await axios.post(
                `http://localhost:8000/api/users/chats/groups`,
                {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                { withCredentials: true }
            );
            setChats([data, ...chats]);
            } catch (err) {
                console.log(err)
            }

        }
        const handleGroup = (userToAdd) => {
            if (selectedUsers.includes(userToAdd)) {
                return setSelectedUsers(prevUsers => prevUsers.filter(user => user._id != userToAdd._id));
        }
            else {
                setSelectedUsers([...selectedUsers, userToAdd]);
                setSearch('')
        }
        }

    return (
        <div className={main.messageListBottom}>
            { isClicked?
                <div className={main.groupChatInputContainer}>
                    <form>
                        <div>
                            <input type="text" name="chatName" placeholder="chat name" onChange={(e) => setGroupChatName(e.target.value)}/>
                            <input placeholder="Add Users: " value={search} onChange={(e) => handleSearch(e.target.value)}/>
                            { selectedUsers.map((user) => (
                                <div className={main.messageListUserHeading} onClick={() => handleGroup(user)}>
                                    <img className={main.profilePicture} src={user.image}/>
                                    <p className={main.messageListUsername}>{user.username}</p>
                                    <p>test</p>
                                </div>
                            ))}
                            { loading ? <div>loading</div> : (searchResult?.slice(0,4).map(user => (
                                <div className={main.messageListUserHeading} onClick={() => handleGroup(user)}>
                                    <img className={main.profilePicture} src={user.image}/>
                                    <p className={main.messageListUsername}>{user.username}</p>
                                </div>
                            )))}
                            <button className={main.chatSendBtn} onClick={() => {handleSubmit()}}>Create</button>
                        </div>
                    </form>
                </div>
                
                : <button className={main.createGroupChatBtn} onClick={() => {setIsClicked(true)}}>Create Group Chat</button>
            }
        </div>
    )
    }

export default GroupChat