const RealEstateService = require("../services/RealEstateService");

const createRealEstate = async (req, res) => {
  try {
    const {
      propertyCode,
      address,
      ward,
      district,
      city,
      area,
      price,
      type,
      status,
      images,
      description,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerAddress,
      ownerIdCard,
      redBook,
      buildingPermit,
      landUseRight,
      legalStatus,
      direction,
      floor,
      roomNumber,
      utilities,
      email,
      user,
    } = req.body;

    if (!propertyCode || !address || !city || !area || !price || !type || !ownerName || !ownerEmail || !ownerPhone || !ownerIdCard || !email) {
      return res.status(200).json({
        status: "ERR",
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const realEstateData = {
      propertyCode,
      address,
      ward,
      district,
      city,
      area,
      price,
      pricePerM2: price / area,
      type,
      status: status || "available",
      images: images || [],
      description,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerAddress,
      ownerIdCard,
      redBook,
      buildingPermit,
      landUseRight,
      legalStatus: legalStatus || "clean",
      direction,
      floor,
      roomNumber,
      utilities: utilities || [],
      email,
      user: user || req.user?.id,
    };

    const response = await RealEstateService.createRealEstate(realEstateData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const updateRealEstate = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (data.price && data.area) {
      data.pricePerM2 = data.price / data.area;
    }

    const response = await RealEstateService.updateRealEstate(id, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getDetailsRealEstate = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await RealEstateService.getDetailsRealEstate(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getAllRealEstate = async (req, res) => {
  try {
    const { search, limit, page, filter } = req.query;
    const response = await RealEstateService.getAllRealEstate(
      search,
      parseInt(limit) || 20,
      parseInt(page) || 1,
      filter ? filter.split(",") : null
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const deleteRealEstate = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await RealEstateService.deleteRealEstate(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

// Lấy danh sách BĐS của user
const getUserRealEstates = async (req, res) => {
  try {
    const email = req.user?.email || req.query.email;
    if (!email) {
      return res.status(400).json({
        status: "ERR",
        message: "Email is required",
      });
    }
    const response = await RealEstateService.getUserRealEstates(email);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  createRealEstate,
  updateRealEstate,
  getDetailsRealEstate,
  getAllRealEstate,
  deleteRealEstate,
  getUserRealEstates,
};

