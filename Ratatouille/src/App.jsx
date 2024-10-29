import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import "./App.css";

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default App;