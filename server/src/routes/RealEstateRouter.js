const express = require("express");
const router = express.Router();
const RealEstateController = require("../controllers/RealEstateController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", RealEstateController.createRealEstate);
router.put("/update/:id", authMiddleWare, RealEstateController.updateRealEstate);
router.get("/get-details/:id", RealEstateController.getDetailsRealEstate);
router.get("/get-all", RealEstateController.getAllRealEstate);
router.get("/user/properties", authMiddleWare, RealEstateController.getUserRealEstates);
router.delete("/delete/:id", authMiddleWare, RealEstateController.deleteRealEstate);

module.exports = router;

