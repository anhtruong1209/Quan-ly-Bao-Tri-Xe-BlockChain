import axios from "axios";
import { axiosJWT } from "./UserService";
import { isJsonString } from "../utils";

const getToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    if (isJsonString(token)) {
      return JSON.parse(token);
    }
    return token;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

const API_BASE_URL = "http://localhost:3001"; // Port của Real Estate server

export const getAllRealEstate = async (search, limit) => {
  try {
    const token = getToken();
    let res = {};
    if (search?.length > 0) {
      res = await axios.get(
        `${API_BASE_URL}/api/realestate/get-all?search=${search}&limit=${limit}`
      );
    } else {
      res = await axios.get(
        `${API_BASE_URL}/api/realestate/get-all?limit=${limit}`
      );
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching real estate:", error);
    throw error;
  }
};

export const createRealEstate = async (data) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/realestate/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error creating real estate:", error);
    throw error;
  }
};

export const getDetailsRealEstate = async (id) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/realestate/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error getting real estate details:", error);
    throw error;
  }
};

export const updateRealEstate = async (id, access_token, data) => {
  try {
    const res = await axiosJWT.put(
      `${API_BASE_URL}/api/realestate/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating real estate:", error);
    throw error;
  }
};

export const deleteRealEstate = async (id, access_token) => {
  try {
    const res = await axiosJWT.delete(
      `${API_BASE_URL}/api/realestate/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting real estate:", error);
    throw error;
  }
};

export const getUserRealEstates = async (access_token) => {
  try {
    const res = await axiosJWT.get(
      `${API_BASE_URL}/api/realestate/user/properties`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting user real estates:", error);
    throw error;
  }
};

