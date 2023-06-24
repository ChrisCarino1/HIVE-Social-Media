import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from 'react-router-dom'

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    console.log("user:",user)
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);


    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        console.log("userInfo:",userInfo)
        }, []);
    
    
    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;