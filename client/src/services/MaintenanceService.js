import axios from "axios";
import { getApiUrl } from "../config/api";

const MAINTENANCE_API_URL = getApiUrl('/api/maintenance');

const getToken = () => {
  const token = localStorage.getItem("access_token");
  return token ? JSON.parse(token) : null;
};

export const createMaintenanceRegistration = async (data) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${MAINTENANCE_API_URL}/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserMaintenanceRegistrations = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${MAINTENANCE_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPendingMaintenanceRegistrations = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${MAINTENANCE_API_URL}/admin/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveMaintenanceRegistration = async (id) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${MAINTENANCE_API_URL}/admin/approve/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectMaintenanceRegistration = async (id) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${MAINTENANCE_API_URL}/admin/reject/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMaintenanceRegistrationDetails = async (id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${MAINTENANCE_API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

