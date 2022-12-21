import "./new.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/NavBar"
import DriverFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"
import InfoIcon from '@mui/icons-material/Info';
import { useState } from "react"
import {userRequest} from "../../services/AuthServices"
import { useLocation,useNavigate } from "react-router-dom"


const New = ({inputs,title}) => {
  let navigate = new useNavigate();
  let location = useLocation(); 
  let For = location.pathname.split("/")[1]
  const[style,setStyle] = useState("");

  const [DataInForm,setDataInForm] = useState({})
  const [error,setError] = useState("")
  const createOne =  async (Data,For) => {
    
    For = For==="items"?"items":"auth/register"
    const data = new FormData();
    for(let element in Data){
    data.append(element,Data[element])
    }
    userRequest.post(`${For}`,data,{
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .then(() => {
      navigate(-1)
    },(error)=>{
      let errordata = error.response["data"];
      setError(errordata["message"])   
    });
    }

  const changeStyle = ()=>{
    setStyle("uploadDone")
  }
  let counter = 1;
  return (
    <div className="new">
      <Sidebar/>
      <div className="newContainer">
        <Navbar/>
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={DataInForm.photo ? URL.createObjectURL(DataInForm.photo) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm6K3Kv2FHT_uZSO62uKzSOSYZ4b1zxw6n_dOkNAL-&s" }
            alt="addimage" 
            />
          </div>
          <div className="right">
            <form action="">
                         <div className="inputsFilds"> 

              {
              inputs.map((element)=>{
                return(
                <div>
                {
                element.map((item)=> (
                  <div className="fromInput" key={counter++}>
                      <label>{item.label}</label>
                      <input  type={item.type} placeholder={item.placeholder}
                      onChange={(e)=>{setDataInForm({
                        ...DataInForm,
                        [item.tag] : e.target.value
                      })}}/>
                  </div>
                ))
               }
                </div>
                )

              })}

          {For==="users"? 
          <div className="fromInput">
            <span>Role :   </span>
            <select id="optns" onChange={(e)=>setDataInForm({
                    ...DataInForm,
                    "role" : e.target.value.toLowerCase()
                  })}>
              <option>USER</option>
              <option>LABOWORKER</option>
              <option>ADMIN</option>
            </select>
          </div>
          :<></> }
          </div>
              <div className="fromInput">
              <label htmlFor="image" className="uploadLabel"> 
                Upload your Image :
                <DriverFolderUploadOutlinedIcon className={style}/> 
              </label>
              <input type="file"  
                  onChange={e=>{setDataInForm({
                    ...DataInForm,
                    "photo" : e.target.files[0]
                  }); changeStyle()}}
                  name="image" id="image" style={{display:"none"}}/>
              </div>
              {
                Object.keys(error).length !== 0 && (<div><InfoIcon/> {error} </div>)
              }
              <div className="send" onClick={()=>createOne(DataInForm,For)}>Send</div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}

export default New