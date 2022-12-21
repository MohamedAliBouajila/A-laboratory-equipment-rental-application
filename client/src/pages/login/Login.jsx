import React, { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import './login.scss'
import {Login as login} from "../../services/AuthServices"

function Login() {
  
  const [username,setUsername] = useState("")
  const [password,setPassword]=useState("")
  const [error,setError] = useState("")
  const handleLogin = (e) => {
    e.preventDefault();
    login({username,password}).then((result)=>{
      if(result){
        setError(result)
      }else{
        window.location.reload(false);
      }
    })
  };


  return (
    <div className='login'>
        <div className="loginContainer">
            <form action="">
                <div className="title">Login</div>
                <div className="inputsFilds">
                    <div className="fromInput">
                        <input type="email" placeholder='Email'
                        onChange={(e)=>{setUsername(e.target.value)}} />
                    </div>
                    <div className="fromInput">
                        <input type="password" placeholder='Password'
                        onChange={(e)=>{setPassword(e.target.value)}} />
                    </div>
                </div>
                <div> { error ? <div className='error'><InfoIcon/>{error}</div>:null }</div>
                <div className="bottom">
                <button onClick={handleLogin} className='loginBtn'>Login</button>
                </div>
            </form> 
        </div>
    </div>
  )
}

export default Login