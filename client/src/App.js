import axios from 'axios'
import io from 'socket.io-client'
import {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'
import {UserContext} from './context/UserContext'
import Login from './components/Login'
import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Registration from './components/Registration'
import PostForm from './components/PostForm'
import ViewPost from './components/ViewPost'
import EditForm from './components/EditForm'
import EditComment from './components/EditComment'
import Profile from './components/MyUserProfile'
import ViewUserProfile from './components/ViewUserProfile'
import ViewFollowers from './components/ViewFollowers'

function App() {

  const [allPosts, setAllPosts] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [socket] = useState(() => io(':8000'))
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loggedInUser, setLoggedInUser] = useState()

  useEffect(() => {
    console.log("Running")

    socket.on('connect', () => {
      console.log("HERE")
      setIsConnected(true)
    })

    return () => {
      socket.disconnect(true)
    }
  }, [])

  return (
    <div>
      <UserContext.Provider value={{loggedInUser, setLoggedInUser}}>
        <Routes>
          <Route path='/' element={<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard allPosts={allPosts} setAllPosts={setAllPosts} allUsers={allUsers} setAllUsers={setAllUsers} socket={socket}/>}/>
          <Route path='/post/create' element={<PostForm allPosts={allPosts} setAllPosts={setAllPosts}/>}/>
          <Route path='/post/view/:id' element={<ViewPost/>} />
          <Route path='/post/edit/:id' element={<EditForm/>} />
          <Route path='/comment/edit/:id' element={<EditComment/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/profile/:id' element={<ViewUserProfile/>}/>
          <Route path='/profile/view/followers/:id' element={<ViewFollowers/>}/>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
