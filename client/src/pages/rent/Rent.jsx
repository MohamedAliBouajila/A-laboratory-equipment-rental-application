import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userRequest } from "../../services/AuthServices";
import "./rent.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/NavBar";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import Form from "../../components/popupform/PopUpForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Rent = () => {
  const navigate = useNavigate();
  let location = useLocation();
  let Id = location.pathname.split("/")[2];
  let path = location.pathname.split("/")[1];
  const [Data, setData] = useState([]);
  const [Photo, setPhoto] = useState({});
  useEffect(() => {
    const getItems = async () => {
      try {
        let res = await userRequest.get(`/rent/find/rent/${Id}`);
        setData(res.data);
        let Data = res.data;
        let userpic = Data.userPhoto.url;
        let itempic = Data.itemPhoto.url;
        setPhoto({ userpic, itempic });
      } catch (e) {
        console.log(e);
      }
    };
    getItems();
  }, [Id]);
console.log(Data)
  return (
    <div className="renting">
      <Sidebar />
      <div className="rentingtContainer">
        <Navbar />

        <div className="rentDetails">
          <div className="goBack" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </div>
          <div className="top">
            <div className="left">
              <div className="cellWithImg">
                <h3>Renter</h3>
                <img
                  className="cellImg"
                  src={Photo.userpic}
                  alt="user-avatar"
                />
                {Data.renter}
              </div>
            </div>
            <div className="right">
              <div className="cellWithImg">
                <h3>Rented Item</h3>
                <img
                  className="cellImg"
                  src={Photo.itempic}
                  alt="item-avatar"
                />
                {Data.rented_item}
              </div>
            </div>
          </div>
          <div className="rentingInfo">
            <div className="rentInfo">
              <ul>
                <li>
                  <HourglassFullIcon className="rent-icon" />
                  <span>
                    <span className="infoLine">Renting Date :</span>{" "}
                    {Data.rent_date}{" "}
                  </span>
                </li>
                <li>
                  <HourglassEmptyIcon className="return-icon" />
                  <span>
                    <span className="infoLine">Return Date :</span>{" "}
                    {Data.return_date}
                  </span>
                </li>
                <li>
                  <FormatListNumberedIcon className="quantity-icon" />
                  <span>
                    <span className="infoLine">Quantity :</span> {Data.quantity}
                  </span>
                </li>
                <li>
                  <div className={`status-icon ${Data.renting_status}`}></div>
                  <span>
                    <span className="infoLine">Renting Status :</span>{" "}
                    {Data.renting_status}
                  </span>
                </li>
              </ul>
            </div>
            <div className="itemDetails">
              <h3>Item Details :</h3>
              {Data.item_details}
            </div>
            <div className="refuseNote">{Data.note? "Refuse note : " + Data.note:null}</div>
          </div>
       
          {path === "rent" ? (
            <div className="rentAction">
              <Form Data={Data} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rent;
