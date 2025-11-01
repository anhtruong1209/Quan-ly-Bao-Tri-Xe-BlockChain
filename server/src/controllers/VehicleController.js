const VehicleService = require("../services/VehicleService");
const validateProduct = (data) => {
  const errors = {};

  // Kiểm tra các trường bắt buộc
  if (!data.name) {
    errors.name = "Tên sản phẩm là bắt buộc";
  }
  if (!data.image || !Array.isArray(data.image) || data.image.length === 0) {
    errors.image =
      "Ảnh sản phẩm là bắt buộc và phải là một mảng chứa ít nhất một URL";
  }
  // Kiểm tra các trường khác...

  // Kiểm tra xem có lỗi nào không
  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
};
const createVehicle = async (req, res) => {
  try {
    console.log("Vô được vehicle controller");
    const {
      name,
      gear,
      image,
      rolling,
      color,
      identifynumber,
      dated,
      fuel,
      email,
      phone,
      address,
      plates,
      bill,
      tax,
      seri,
      license,
      engine,
      frame,
      type,
      brand,
      description,
    } = req.body;
    const { isValid, errors } = validateProduct(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    if (
      !name ||
      !fuel ||
      !rolling ||
      !color ||
      !gear ||
      !image ||
      !identifynumber ||
      !dated ||
      !email ||
      !phone ||
      !address ||
      !plates ||
      !bill ||
      !tax ||
      !seri ||
      !license ||
      !type ||
      !engine ||
      !frame ||
      !brand
    ) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await VehicleService.createVehicle(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateVehicle = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await VehicleService.updateVehicle(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    if (!vehicleId) {
      return res.status(200).json({
        status: "ERR",
        message: "The vehicleId is required",
      });
    }
    const response = await VehicleService.deleteVehicle(vehicleId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsVehicle = async (req, res) => {
  try {
    const carId = req.params.id;
    if (!carId) {
      return res.status(200).json({
        status: "ERR",
        message: "The carId is required",
      });
    }
    const response = await VehicleService.getDetailsVehicle(carId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailsVehiclePlate = async (req, res) => {
  try {
    const plate = req.params.plate;
    if (!plate) {
      return res.status(200).json({
        status: "ERR",
        message: "The plate is required",
      });
    }
    const response = await VehicleService.getDetailsVehiclePlate(plate);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await VehicleService.deleteManyVehicle(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllVehicle = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await VehicleService.getAllVehicle(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllType = async (req, res) => {
  try {
    const response = await VehicleService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const gettAllColor = async (req, res) => {
  try {
    const response = await VehicleService.gettAllColor();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getPrice = async (req, res) => {
  try {
    const response = await VehicleService.getPrice(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createVehicle,
  getDetailsVehicle,
  deleteVehicle,
  getDetailsVehiclePlate,
  deleteMany,
  getAllType,
  gettAllColor,
  updateVehicle,
  getAllVehicle,
  getPrice,
};
