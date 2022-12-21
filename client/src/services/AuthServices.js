import axios from "axios"
const BASE_URL = "http://localhost:1337/api/"
const LOGIN_URL = "http://localhost:1337/api/auth/login"

const getRole = () => {
    let Role = "";
    if(JSON.parse(localStorage.getItem("userData"))){
        Role =  JSON.parse(localStorage.getItem("userData")).Role;
    }
   return Role
};

const publicRequest = axios.create({
    baseURL: LOGIN_URL,
    headers: {
      'Content-Type': 'application/json'
    }
})

let tokens = "";
if(JSON.parse(localStorage.getItem("userData"))){
    tokens =  JSON.parse(localStorage.getItem("userData")).userToken;
}

const userRequest = axios.create({
    baseURL:BASE_URL,
    headers:{
        authorization:tokens
    }
})


const  Login = async(auth)=>{
    let error;
    const setError= (res)=>{
        error = res;
    }

    await axios.post(`${LOGIN_URL}`, auth).then((data)=>{
        window.localStorage.setItem("userData",JSON.stringify(data.data));
    },(error)=>{
        setError(error.response.data)
    })
    return error
}


const Logout = ()=>{
    window.localStorage.clear();
    window.location.reload(false);
    window.location.replace("/");
}

const VerfiyLoggedIn = async()=>{
    let userData = "";
    if(JSON.parse(localStorage.getItem("userData"))){
        userData = await JSON.parse(localStorage.getItem("userData")).userToken;
    }
    let loginStatus="";
    let setLoginStatus = (res)=>{
        loginStatus = res
    }
    await axios.get(`${BASE_URL}auth/VerfiyLoggedIn`,{
        headers:{
            authorization: userData,
        }
    }).then((user)=>{
        setLoginStatus(user.data)
    },(e)=>{
        window.localStorage.clear();
        setLoginStatus(false)
        console.clear()
    })
    return loginStatus
}





export {Login,Logout,VerfiyLoggedIn,publicRequest,userRequest,getRole} 