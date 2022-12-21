import React, { useContext, useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Rent from "./pages/rent/Rent";
import "./style/dark.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { userInputs, itemInputs } from "./bin/fromSource";
import { DarkModeContext } from "./context/darkModeContext";
import { VerfiyLoggedIn, getRole } from "../src/services/AuthServices";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    let role = getRole();
    setRole(role);
  }, []);

  useEffect(() => {
    VerfiyLoggedIn().then((res) => {
      setLoggedIn(res);
    });
  }, []);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Router>
        <Routes>
          <Route path="/">
          <Route path="/" element={loggedIn ? <Home /> : <Login />}/>
            <Route path="*" element={loggedIn ? <Home /> : <Login />}/>

            {role === "admin" ? (
              <Route path="/users">
                <Route index element={<List type="users" />}></Route>
                <Route path=":userId" element={<Single />}></Route>
                <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
                ></Route>
              </Route>
            ) : null}
            {loggedIn ? 
            (<Route path="/profile">
              <Route index element={<Single For={"profile"} />}></Route>
            </Route>):null
            }
            
            {role === "laboworker" ? (
              <Route path="/items">
                <Route index element={<List type="items" />}></Route>
                <Route path=":productId" element={<Single />}></Route>
                <Route
                  path="new"
                  element={<New inputs={itemInputs} title="Add New Item" />}
                ></Route>
              </Route>
            ) : null}
            {role === "laboworker" || role === "user" ? (
              <>
                <Route path="/rent">
                  <Route index element={<List type="rents" />}></Route>
                  <Route path=":rentId" element={<Rent />}></Route>
                </Route>
                <Route path="/requests">
                  <Route index element={<List type="requests" />}></Route>
                  <Route path=":rentId" element={<Rent />}></Route>
                </Route>
              </>
            ) : null}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
