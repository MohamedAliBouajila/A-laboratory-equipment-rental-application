import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRole } from "../../services/AuthServices";
import InfoIcon from "@mui/icons-material/Info";
import "./popupform.scss";
import { userRequest } from "../../services/AuthServices";
const PopUpForm = ({ Data }) => {
  let location = useLocation();
  let rentId = location.pathname.split("/")[2];
  const [visible, setVisible] = useState(false);
  const [formElementType, setFormElementType] = useState("");
  const [DataInForm, setDataInForm] = useState({});
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    let role = getRole();
    setRole(role);
  }, []);

  const showElement = (e) => {
    let target = e.target.innerHTML;
    setFormElementType(target);

    setVisible((prev) => !prev);

    setDataInForm({
      return_date: Data.return_date,
      rent_date: Data.rent_date,
      quantity: Data.quantity,
    });
  };

  const UpdateRent = async (itemData) => {
    let renting_status = "";
  
    if (formElementType === "Accept") {
      renting_status = "approved";
    } else if (formElementType === "Reject") {
      renting_status = "refused";
    } else if (formElementType === "Set Returned") {
      renting_status = "returned";
      delete itemData["quantity"];
    } else if (formElementType === "Cancel") {
      renting_status = "canceled";
    } 
    
    let data = {}

    if(renting_status==="canceled"){
      data= {renting_status: renting_status }
    }else{ 
     data={...itemData, renting_status: renting_status}
    };
    
    userRequest
      .put(`rent/${rentId}`, data)
      .then(
        () => {
          window.location.reload(false);
        },
        (error) => {
          const errordata = error.response.data;
          setError(errordata);
        }
      );
  };

  const hideElement = () => {
    setVisible((prev) => !prev);
  };

  const rentactions = () => {
    switch (Data.renting_status) {
      case "pending" :
        if(role==="laboworker"){
        return (<div className="cellAction">
            <div onClick={(e) => showElement(e)} className="acceptButton">
              Accept
            </div>
            <div onClick={(e) => showElement(e)} className="refuseButton">
              Reject
            </div>
          </div>);
        }else if(role==="user"){
          return (<div className="cellAction">
          <div onClick={(e) => showElement(e)} className="cancelBtn">
            Cancel
          </div>
        </div>);
        }
    break;
      case "approved":
        if(role==="laboworker"){
        return (
          <div className="cellAction">
            <div onClick={(e) => showElement(e)} className="setReturnedButton">
              Set Returned
            </div>
          </div>
        );
        }
        break;

      case "retarded":
        if(role==="laboworker"){
        return (
          <div className="cellAction">
            <div onClick={(e) => showElement(e)} className="setReturnedButton">
              Set Returned 
            </div>
          </div>
        );
        }
        break;

      default:
        break;
    }
  };

  const formElement = () => {
    switch (formElementType) {
      case "Accept":
        return (
          <>
            <div className="fromInput">
              <label>Rent Date : </label>
              <input
                type="Date"
                value={DataInForm.rent_date}
                onChange={(e) =>
                  setDataInForm({
                    ...DataInForm,
                    rent_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="fromInput">
              <label>Return Date :</label>
              <input
                type="Date"
                value={DataInForm.return_date}
                onChange={(e) =>
                  setDataInForm({
                    ...DataInForm,
                    return_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="fromInput">
              <label>Quantity : </label>
              <input
                type="number"
                required
                value={DataInForm.quantity || 0}
                min="0"
                onChange={(e) =>
                  setDataInForm({
                    ...DataInForm,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
            </div>

            {error ? (
              <div className="errorContainer">
                <InfoIcon /> {error}{" "}
              </div>
            ) : null}
            <div className="formBtns">
              <div
                className="doneButton"
                onClick={() => UpdateRent(DataInForm)}
              >
                Done
              </div>
              <div className="closeButton" onClick={() => hideElement()}>
                Close
              </div>
            </div>
          </>
        );
      case "Reject":
        return (
          <>
            <div className="noteContainer">
              <label>Note : </label>
              <textarea
                onChange={(e) =>
                  setDataInForm({
                    ...DataInForm,
                    note: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="formBtns">
              <div
                className="rejectButton"
                onClick={() => UpdateRent(DataInForm)}
              >
                Reject
              </div>
              <div className="closeButton" onClick={() => hideElement()}>
                Close
              </div>
            </div>
          </>
        );

      case "Set Returned":
        return (
          <>
            <div className="setRetrunContainer">
              <p>Are you sure, you want to set this rent to returned?</p>
            </div>
            <div className="formBtns">
              <div
                className="returnButton"
                onClick={() => UpdateRent(DataInForm)}
              >
                Return
              </div>
              <div className="closeButton" onClick={() => hideElement()}>
                Close
              </div>
            </div>
          </>
        );
        case "Cancel":
          return (
            <>
              <div className="setRetrunContainer">
                <p>Are you sure, you want to cancel your request?</p>
              </div>
              <div className="formBtns">
                <div
                  className="cancelButton"
                  onClick={() => UpdateRent(DataInForm)}
                >
                  Yes
                </div>
                <div className="closeButton" onClick={() => hideElement()}>
                  Close
                </div>
              </div>
            </>
          );
      default:
        break;
    }
  
  };

  return (
    <>
   
      <div className="popUp">
        {rentactions()}
        {visible && (
          <div className="popupformContainer">
            <div className="inputsFilds">
              <form method="get">{formElement(Data)}</form>
            </div>
          </div>
        )}
      </div>
    
    </>
  );
};

export default PopUpForm;
