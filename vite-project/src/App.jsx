import Navbar from "./components/Navbar";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route } from "react-router-dom";
import {Home, Classes, Accounts, Me, Notifications} from "./components/pages";
import "./App.css"

export default function App(){
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/accounts" element={<Accounts />}></Route>
          <Route path="/classes" element={<Classes />}></Route>
          <Route path="/notifications" element={<Notifications />}></Route>
          <Route path="/me" element={<Me />}></Route>
        </Routes>
      </div>
    </>
  );
}