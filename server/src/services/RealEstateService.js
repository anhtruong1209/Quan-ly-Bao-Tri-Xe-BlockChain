const RealEstate = require("../model/RealEstateModel");
const RealEstateBlockchain = require("./RealEstateBlockchainService");
const crypto = require("crypto");

const createRealEstate = (newRealEstate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProperty = await RealEstate.findOne({
        propertyCode: newRealEstate.propertyCode,
      });
      if (checkProperty !== null) {
        resolve({
          status: "ERR",
          message: "Mã tài sản đã tồn tại",
        });
        return;
      }

      const property = await RealEstate.create(newRealEstate);
      resolve({
        status: "OK",
        message: "Đăng ký bất động sản thành công",
        data: property,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateRealEstate = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await RealEstate.findByIdAndUpdate(id, data, { new: true });
      if (!property) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy bất động sản",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "Cập nhật thành công",
        data: property,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailsRealEstate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await RealEstate.findById(id);
      if (!property) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy bất động sản",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: property,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllRealEstate = async (search, limit, page, filter) => {
  try {
    let query = {};
    
    if (search) {
      query.$or = [
        { propertyCode: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    if (filter && filter.length >= 2) {
      const field = filter[0];
      const value = filter[1];
      query[field] = { $regex: new RegExp(value, "i") };
    }

    const skip = (page - 1) * limit;
    const properties = await RealEstate.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await RealEstate.countDocuments(query);

    return {
      status: "OK",
      message: "SUCCESS",
      data: properties,
      total: total,
      page: page,
      limit: limit,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const deleteRealEstate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const property = await RealEstate.findByIdAndDelete(id);
      if (!property) {
        resolve({
          status: "ERR",
          message: "Không tìm thấy bất động sản",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "Xóa thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Lấy danh sách BĐS của user
const getUserRealEstates = async (email) => {
  try {
    const properties = await RealEstate.find({ email: email }).sort({ createdAt: -1 });
    return {
      status: "OK",
      message: "SUCCESS",
      data: properties,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

// Tạo content hash cho blockchain
const createContentHash = (content) => {
  const contentString = JSON.stringify(content);
  return crypto.createHash("sha256").update(contentString).digest("hex");
};

module.exports = {
  createRealEstate,
  updateRealEstate,
  getDetailsRealEstate,
  getAllRealEstate,
  deleteRealEstate,
  getUserRealEstates,
  createContentHash,
};

