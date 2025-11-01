import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllVehicle = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `http://localhost:3001/api/vehicle/get-all?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `http://localhost:3001/api/vehicle/get-all?limit=${limit}`
    );
  }
  return res.data;
};

// Generic filter by any field (e.g., brand, type, name)
export const getVehiclesByField = async (field, value, page, limit) => {
  const params = new URLSearchParams();
  if (field && value) {
    params.append("filter", field);
    params.append("filter", value);
  }
  if (typeof limit !== "undefined") params.append("limit", limit);
  if (typeof page !== "undefined") params.append("page", page);
  const res = await axios.get(
    `http://localhost:3001/api/vehicle/get-all?${params.toString()}`
  );
  return res.data;
};
export const getAllVehicleByPlates = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      //http://localhost:3001/api/vehicle/get-all?filter=plates&filter=s
      `http://localhost:3001/api/vehicle/get-all?filter=plates&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `http://localhost:3001/api/vehicle/get-all?limit=${limit}`
    );
  }
  return res.data;
};

export const getVehicleType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `http://localhost:3001/api/vehicle/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const createVehicle = async (data) => {
  console.log("Vo duoc create ben service");
  console.log("Data: ", data);
  try {
    const res = await axios.post(
      `http://localhost:3001/api/vehicle/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi gì rồi : ", error);
  }
};
export const getPricePredict = async (data) => {
  // const res = await axiosJWT.post(
  //   `http://localhost:3001/api/vehicle/get-price-predict`,
  //   data
  // );
  // console.log("Gia ca cua xe: ", res);
  // return res.data;
  
  try {
    const res = await axios.post(
      `http://localhost:3001/api/vehicle/get-price-predict`,
      data
    );
    
    return res.data;
  } catch (error) {
    console.log("Lỗi gì rồi : ", error);
  }
};
export const getDetailsVehicle = async (id) => {
  const res = await axios.get(
    `http://localhost:3001/api/vehicle/get-details/${id}`
  );
  return res.data;
};
export const getDetailsVehicleByPlate = async (plate) => {
  const res = await axios.get(
    `http://localhost:3001/api/vehicle/get-details-plate/${plate}`
  );
  return res.data;
};

export const updateVehicle = async (id, access_token, data) => {
  try {
    // console.log("Access token ben update: ", access_token);
    const res = await axiosJWT.put(
      `http://localhost:3001/api/vehicle/update/${id}`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const deleteVehicle = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `http://localhost:3001/api/vehicle/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyVehicle = async (data, access_token) => {
  const res = await axiosJWT.post(
    `http://localhost:3001/api/vehicle/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeVehicle = async () => {
  const res = await axios.get(`http://localhost:3001/api/vehicle/get-all-type`);
  return res.data;
};
export const getAllColor = async () => {
  const res = await axios.get(`http://localhost:3001/api/vehicle/get-all-color`);
  return res.data;
};

