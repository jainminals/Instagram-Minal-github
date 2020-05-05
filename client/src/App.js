import React,{useContext,useEffect,createContext, useReducer} from 'react';
import Navbar from './components/Navbar';
import "./App.css"
import {BrowserRouter , Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screen/Home'
import Signin from './components/screen/Login'
import Profile from './components/screen/Profile'
import Signup from './components/screen/Signup'
import SubscribesUserPosts from './components/screen/SubscribesUserPosts'
import CreatePost from './components/screen/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screen/UserProfile'

export const UserContext = createContext()

 const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(typeof(user),user)
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      history.push('/signin')
    }
  },[])
   return(
     <Switch>
       <Route exact path = "/">
      <Home></Home>
      </Route>
      <Route path = "/signin">
      <Signin></Signin>
      </Route>
      <Route exact path = "/profile">
      <Profile></Profile>
      </Route>
      <Route path = "/signup">
        <Signup></Signup>
      </Route>
      <Route path = "/createpost">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribesUserPosts></SubscribesUserPosts>
      </Route>
     </Switch>

   )
 }

function App() {
  const[state,dispatch]= useReducer(reducer,initialState)
  return (
    <UserContext.Provider value ={{state,dispatch}}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
