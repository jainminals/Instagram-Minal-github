import React ,{useContext}from 'react'
import{Link, useHistory} from 'react-router-dom'
import{UserContext} from '../App'

 const Navbar = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList=()=>{
        if(state){
            return  [
                <li><Link to ="/profile">Profile</Link></li>,
                <li><Link to ="/createpost">Create Post</Link></li>,
                <li><Link to ="/myfollowingpost">My Following Post</Link></li>,
                <li>
                      <button className="btn #f44336 red" 
                      onClick={()=>
                      {localStorage.clear()
                      dispatch({type:"CLEAR"})
                      history.push('/signin')
                      }}>
                    Log Out
                 </button>
                </li>
            ]
        }else{
            return[
                <li><Link to ="/signin">Login</Link></li>,
                <li><Link to ="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <div>     
            <nav>
                <div className="nav-wrapper white">
                <Link to ={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                   {renderList()}
                    
                </ul>
                </div>
            </nav>
        </div>
    )
}
export default Navbar