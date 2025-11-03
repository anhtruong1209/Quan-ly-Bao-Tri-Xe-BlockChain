import axios from "axios";
import { axiosJWT } from "./UserService";
import { getApiUrl } from "../config/api";

export const getAllVehicle = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      getApiUrl(`/api/vehicle/get-all?filter=name&filter=${search}&limit=${limit}`)
    );
  } else {
    res = await axios.get(
      getApiUrl(`/api/vehicle/get-all?limit=${limit}`)
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
    getApiUrl(`/api/vehicle/get-all?${params.toString()}`)
  );
  return res.data;
};
export const getAllVehicleByPlates = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      //${API_BASE_URL}/api/vehicle/get-all?filter=plates&filter=s
      getApiUrl(`/api/vehicle/get-all?filter=plates&filter=${search}&limit=${limit}`)
    );
  } else {
    res = await axios.get(
      getApiUrl(`/api/vehicle/get-all?limit=${limit}`)
    );
  }
  return res.data;
};

export const getVehicleType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      getApiUrl(`/api/vehicle/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
    );
    return res.data;
  }
};

export const createVehicle = async (data) => {
  console.log("Vo duoc create ben service");
  console.log("Data: ", data);
  try {
    const res = await axios.post(
      getApiUrl('/api/vehicle/create'),
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi gì rồi : ", error);
  }
};
export const getPricePredict = async (data) => {
  // const res = await axiosJWT.post(
  //   `${API_BASE_URL}/api/vehicle/get-price-predict`,
  //   data
  // );
  // console.log("Gia ca cua xe: ", res);
  // return res.data;
  
  try {
    const res = await axios.post(
      getApiUrl('/api/vehicle/get-price-predict'),
      data
    );
    
    return res.data;
  } catch (error) {
    console.log("Lỗi gì rồi : ", error);
  }
};
export const getDetailsVehicle = async (id) => {
  const res = await axios.get(
    getApiUrl(`/api/vehicle/get-details/${id}`)
  );
  return res.data;
};
export const getDetailsVehicleByPlate = async (plate) => {
  const res = await axios.get(
    getApiUrl(`/api/vehicle/get-details-plate/${plate}`)
  );
  return res.data;
};

export const updateVehicle = async (id, access_token, data) => {
  try {
    // console.log("Access token ben update: ", access_token);
    const res = await axiosJWT.put(
      getApiUrl(`/api/vehicle/update/${id}`),
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
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
    getApiUrl(`/api/vehicle/delete/${id}`),
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyVehicle = async (data, access_token) => {
  const res = await axiosJWT.post(
    getApiUrl('/api/vehicle/delete-many'),
    data,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeVehicle = async () => {
  const res = await axios.get(getApiUrl('/api/vehicle/get-all-type'));
  return res.data;
};
export const getAllColor = async () => {
  const res = await axios.get(getApiUrl('/api/vehicle/get-all-color'));
  return res.data;
};

// Lấy vehicles của user (user chỉ xem được của mình, admin xem được tất cả)
export const getUserVehicles = async (access_token) => {
  try {
    const res = await axiosJWT.get(getApiUrl('/api/vehicle/user/vehicles'), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting user vehicles:", error);
    throw error;
  }
};

