const express = require("express");
const router = express.Router();
const VehicleController = require("../controllers/VehicleController");
const { authMiddleWare } = require("../middleware/authMiddleware");
const Vehicle = require("../model/VehicleModel");
//http://localhost:3001/api/vehicle/get-details-plate
router.post("/create", VehicleController.createVehicle);
router.put("/update/:id", authMiddleWare, VehicleController.updateVehicle);
router.get("/get-details/:id", VehicleController.getDetailsVehicle);
router.get("/get-details-plate/:plate", VehicleController.getDetailsVehiclePlate);
router.get("/get-all", VehicleController.getAllVehicle);
router.delete("/delete/:id", authMiddleWare, VehicleController.deleteVehicle);
router.post("/delete-many", authMiddleWare, VehicleController.deleteMany);
router.get("/get/:id", VehicleController.getDetailsVehicle);
router.get("/get-all-type", VehicleController.getAllType);
router.get("/get-all-color", VehicleController.gettAllColor);
router.post("/get-price-predict", VehicleController.getPrice);

module.exports = router;
