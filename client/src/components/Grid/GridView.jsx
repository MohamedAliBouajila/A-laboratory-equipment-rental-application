import React, { useEffect,useState } from 'react'
import './grid.scss'
import {userRequest} from '../../services/AuthServices'
function GridView() {
  const [Data,setData] = useState([]);
  const [itemData,setItemData] = useState({});
  const [RentData,setRentData] = useState({});
  const [visible,setVisible] = useState(false);
  const [Error,setError] = useState("")
    useEffect(()=>{
      const getItems = async () => {
        try{
           let res = await userRequest.get("/items/renterview");
           setData(res.data)
           setRentData({
            rent_date:new Date().toJSON().slice(0, 10),
            return_date:new Date().toJSON().slice(0, 10),
            quantity:1
           })
        }catch(e){
          console.log(e)
        }
      }
      getItems();
      },[])

      const passRent =  async (id) => {
        userRequest.post(`/rent/${id}`, 
        {...RentData})
        .then(() => {
          window.location.reload(false);
        },(error)=>{
          const errordata = error.response.data;
          setError(errordata)   
        });
        }
    let statusClassName = (a)=>a===0 ||a ===undefined?"outOfStock":""; 
    let statusText =(a)=> a===0 ||a ===undefined? "Out of stock":`Available Items : ${a}`;
  return (
    <div className='gridViewContainer'>
      {Data.map((item)=>(
        <div className="gridItem" key={item.id}>
            <div className="itemImg">
                <img src={item.photo.url} alt="item_photo"/>
            </div>
            <div className="itemDetails">
                <div className="itemName">{item.item_name}</div>
                <div className={`available ${statusClassName(item.available_items)}`}>{statusText(item.available_items)}</div>
            </div>
            <div className="showBtn">
              <div className='btn' onClick={()=>{setVisible((prev)=>(!prev));setItemData(item);}}>Details</div>
            </div>
        </div>
      ))     
    }
    {visible && <div className="popup">
      <div className="top">
      <div className="itemPhoto">
        <img src={itemData.photo.url} alt="" />
      </div>
      <div>
      <div className="itemName">
            {itemData.item_name}
      </div>
      <div className="itemAvailable">
      {statusText(itemData.available_items)}
      </div>
      </div>
      
      </div>
      <div className="middle">
        <div className="itemDetails">
          <div>Item Details: </div>
            {itemData.item_details}
        </div>
        { itemData.available_items>0 &&
        <div className="RentingSetting">
          <div className="inputs">
          <span>Rent Date: </span>
          <input type="date" value={RentData.rent_date} onChange={e => setRentData({
                ...RentData,
                rent_date: e.target.value
              })} />
          </div>
          <div className="inputs">
          <span>Return Data: </span>
          <input type="date" value={RentData.return_date} onChange={e => setRentData({
                ...RentData,
                return_date: e.target.value
              })}/>
          </div>
          <div className="inputs">
          <span>Quantity: </span>
          <input type="number" max={itemData.available_items} value={RentData.quantity} onChange={e => setRentData({
                ...RentData,
                quantity: parseInt(e.target.value)
              })}/>
          </div>
        </div>
        } 
      </div>
     
      <div className="bottom">
        { Error ? <div className='Error'>{Error}</div> : null}
        <div className="ActionBtns">
        { itemData.available_items>0 &&
          <div className="rentBtn" onClick={()=>passRent(itemData.id)}>Rent It</div>
        }
          <div className="closeBtn" onClick={()=>setVisible((prev)=>(!prev))}>Close</div>
        </div>
      </div>
     
      </div>}
    </div>
  )
}

export default GridView