import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import Vehicles from "../pages/Vehicles/Vehicles";
import VehicleByType from "../pages/VehicleByType/VehicleByType";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/detail/:plate" element={<Detail />} />
      <Route path="/vehicle-type/:name" element={<VehicleByType />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Routers;
