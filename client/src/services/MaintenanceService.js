import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/maintenance";

const getToken = () => {
  const token = localStorage.getItem("access_token");
  return token ? JSON.parse(token) : null;
};

export const createMaintenanceRegistration = async (data) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_BASE_URL}/create`,
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
    const response = await axios.get(`${API_BASE_URL}/user`, {
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
    const response = await axios.get(`${API_BASE_URL}/admin/pending`, {
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
      `${API_BASE_URL}/admin/approve/${id}`,
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
      `${API_BASE_URL}/admin/reject/${id}`,
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
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

