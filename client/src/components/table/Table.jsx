import React from "react";
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { userRequest } from "../../services/AuthServices";

const List = ({ filter }) => {
  let location = useLocation();
  let path = location.pathname.split("/")[1];

  let query = path === "requests" ? "?rentingstatus=pending" : "";
  const [items, setItems] = useState([]);
  const [filtredItems, setFiltredItems] = useState({});

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await userRequest.get(`/rent/${query}`);
        setItems(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getItems();
  }, [query]);

  useEffect(() => {
    setFiltredItems(
      [undefined, "", "status"].includes(filter)
        ? items
        : items.filter((item) => item.renting_status === filter)
    );
  }, [items, filter]);

  let counter = 1;

  return items.length ? (
    <TableContainer component={Paper} className="table">
      <Table aria-label="simple table" className="tabContent">
        <TableHead>
          <TableRow className="tableHeadItems">
            <TableCell className="tableCell">N°</TableCell>
            <TableCell className="tableCell">Rent ID</TableCell>
            <TableCell className="tableCell">Renting date</TableCell>
            <TableCell className="tableCell">Return date</TableCell>
            <TableCell className="tableCell">Quantity</TableCell>
            <TableCell className="tableCell">Renting Status</TableCell>
            <TableCell className="tableCell">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="tableCell">{counter++}</TableCell>
              <TableCell className="tableCell">{item.id}</TableCell>
              <TableCell className="tableCell">{item.rent_date}</TableCell>
              <TableCell className="tableCell">{item.return_date}</TableCell>
              <TableCell className="tableCell">{item.quantity}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${item.renting_status}`}>
                  {item.renting_status}
                </span>
              </TableCell>
              <TableCell className="tableCell">
                <Link to={`/${"rent" || path}/${item.id}`} className="link">
                  <div className="viewButton">View</div>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div>Nothing</div>
  );
};

export default List;
