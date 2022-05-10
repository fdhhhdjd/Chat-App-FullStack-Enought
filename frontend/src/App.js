import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { Chat, Home, Login, Navigation, Signup } from "./Import/Index";
function App() {
  return (
    <React.Fragment>
      <ToastContainer position="top-center" />
      <Navigation />
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
