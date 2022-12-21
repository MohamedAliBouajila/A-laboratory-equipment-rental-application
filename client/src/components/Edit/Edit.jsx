import React from 'react'
import './edit.scss'
import DriverFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"
import { useState,useEffect } from "react"
import { useLocation } from "react-router-dom"
import {userRequest} from '../../services/AuthServices'
function Edit({inputs,data,pic}) {
    let location = useLocation();
    let id = location.pathname.split("/")[2];
    let For = location.pathname.split("/")[1];
    For = For==="items"?"item":"user"

    const[style,setStyle] = useState("")
    const [DataInForm,setDataInForm] = useState({})
    useEffect(()=>{
      const setItems = async () => {
        setDataInForm({...data});
      };
      setItems();
      },[data]
    )

    const createOne =  async (Data) => {
      const data = new FormData();
      for(let element in Data){
      data.append(element,Data[element])
      }
      userRequest.put(`${For}s/${id}`,data,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      .then(() => {
        window.location.reload(false);
      });
      }
  
    const changeStyle = ()=>{
      setStyle("uploadDone")
    }
    let key = 0;
  return (
    <div className='Edit'>

           <div className="editContainer">

           <div className="Container">
            <div className="top">
                <div className="title">{`Edit this ${For}`}</div>
            </div>
            
            <div className="formContainer"> 
            <div className="imageContainer">
            <img src={DataInForm.photo ? URL.createObjectURL(DataInForm.photo) : pic.url }
           alt="addimage" 
            />
            </div>
            <div className="inputsContainer">
            <form action="">
                         <div className="inputsFilds"> 

              {
              inputs.map((element)=>{
                return(
                <div>
                {
                element.map((item)=> (
                  <div className="fromInput" key={key++}>
                      <label>{item.label}</label>
                      <input  type={item.type} placeholder={item.placeholder} value={DataInForm[item.tag]}
                      onChange={(e)=>{setDataInForm({
                        ...DataInForm,
                        [item.tag] : e.target.value
                      })}}/>
                  </div>
                ))
               }
                </div>
                )

              })
              
              
              }
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
       
              <div className="send" onClick={()=>createOne(DataInForm)}>Edit</div>

            </form>
            </div>
            </div>
           </div>
           </div>
     
    </div>
  )
}

export default Edit