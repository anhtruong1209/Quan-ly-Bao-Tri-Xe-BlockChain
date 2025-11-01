const Vehicle = require("../model/VehicleModel");

const createVehicle = (newVehicle) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      fuel,
      color,
      gear,
      rolling,
      identifynumber,
      image,
      dated,
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
    } = newVehicle;
    try {
      const checkVehicle = await Vehicle.findOne({
        name: name,
      });
      if (checkVehicle !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
        });
      }
      const newVehicle = await Vehicle.create({
        name,
        identifynumber,
        image,
        fuel,
        gear,
        rolling,
        color,
        dated: Date(dated),
        email,
        phone: Number(phone),
        address,
        description,
        // discount: Number(discount),
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
      });
      if (newVehicle) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newVehicle,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsVehicle = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const car = await Vehicle.findOne({
        _id: id,
      });
      if (car === null) {
        resolve({
          status: "ERR",
          message: "The car is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: car,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsVehiclePlate = (plate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const car = await Vehicle.findOne({
        plates: plate,
      });
      if (car === null) {
        console.log("Plate : ", plate);
        resolve({
          status: "ERR",
          message: "The car is not defined sai plate",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: car,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteVehicle = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkVehicle = await Vehicle.findOne({
        _id: id,
      });
      if (checkVehicle === null) {
        resolve({
          status: "ERR",
          message: "The car is not defined",
        });
      }

      await Vehicle.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete car success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteManyVehicle = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Vehicle.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getAllVehicle = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("page: ", page);
      console.log("limit: ", limit);
      const totalVehicle = await Vehicle.countDocuments();
      console.log("total: ", totalVehicle);

      let allVehicle = [];
      if (filter) {
        console.log("Vo duoc filter");
        const label = filter[0];
        const allObjectFilter = await Vehicle.find({
          [label]: { $regex: new RegExp(filter[1], "i") },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allObjectFilter,
          total: totalVehicle,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalVehicle / limit),
        });
      }
      if (sort) {
        console.log("Vo duoc sort");
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allVehicleSort = await Vehicle.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allVehicleSort,
          total: totalVehicle,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalVehicle / limit),
        });
      }
      if (!limit) {
        console.log("Vo duoc !limit");
        allVehicle = await Vehicle.find().sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        console.log("Vo duoc else");
        allVehicle = await Vehicle.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: allVehicle,
        total: totalVehicle,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalVehicle / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Vehicle.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const gettAllColor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allColor = await Vehicle.distinct("color");
      resolve({
        status: "OK",
        message: "Success",
        data: allColor,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateVehicle = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Vehicle.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      const updatedProduct = await Vehicle.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const { spawn } = require('child_process');
const path = require('path');

const getPrice = (inputData) => {
  console.log(inputData)
  return new Promise((resolve, reject) => {
    try {
      // Đường dẫn đến thư mục chứa file predict.py
      const pythonScriptsDir = path.join(__dirname, '../model_ML');

      // Đường dẫn đến Python script
      const pythonScriptPath = path.join(pythonScriptsDir, 'predict.py');

      // Chuyển đổi đầu vào thành chuỗi JSON
      const inputDataString = JSON.stringify(inputData);

      // Gọi Python process để thực hiện dự đoán
      const pythonProcess = spawn('python', [pythonScriptPath, inputDataString], {
        cwd: pythonScriptsDir, // Thiết lập thư mục làm việc cho quá trình Python
      });

      // Biến lưu trữ kết quả dự đoán
      let predictedPrice = null;

      // Lắng nghe sự kiện stdout từ Python script
      pythonProcess.stdout.on('data', (data) => {
        predictedPrice = parseFloat(data.toString().trim());
        console.log('Predicted price:', predictedPrice);
      });

      // Xử lý sự kiện khi quá trình Python kết thúc
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          reject(new Error('An error occurred during prediction.'));
        } else {
          // Kiểm tra và trả về kết quả
          if (predictedPrice !== null && !isNaN(predictedPrice)) {
            resolve({
              status: 'OK',
              message: 'Success',
              data: predictedPrice,
            });
          } else {
            reject(new Error('Invalid prediction result.'));
          }
        }
      });

      // Xử lý lỗi nếu có từ Python script
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        reject(new Error('An error occurred during prediction.'));
      });

    } catch (error) {
      console.error('Error in getPrice:', error);
      reject(error);
    }
  });
};
module.exports = {
  createVehicle,
  getDetailsVehicle,
  deleteManyVehicle,
  getDetailsVehiclePlate,
  deleteVehicle,
  updateVehicle,
  gettAllColor,
  getAllType,
  getAllVehicle,
  getPrice,
};
