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

const API_BASE_URL = "http://localhost:3001";

export const createTransaction = async (payload) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.post(
      `${API_BASE_URL}/api/transaction/create`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    if (error?.response?.data?.message?.includes("token") || error?.response?.status === 401) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

export const listTransactions = async (vehicleId, status) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const params = {};
    if (vehicleId) params.realEstateId = vehicleId;
    if (status) params.status = status;
    const res = await axiosJWT.get(
      `${API_BASE_URL}/api/transaction/list`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error listing transactions:", error);
    throw error;
  }
};

export const getTransactionDetails = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.get(
      `${API_BASE_URL}/api/transaction/details/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting transaction details:", error);
    throw error;
  }
};

export const getUserTransactions = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.get(
      `${API_BASE_URL}/api/transaction/user/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting user transactions:", error);
    throw error;
  }
};

export const getPendingTransactions = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.get(
      `${API_BASE_URL}/api/transaction/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error getting pending transactions:", error);
    throw error;
  }
};

export const approveTransaction = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.put(
      `${API_BASE_URL}/api/transaction/approve/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error approving transaction:", error);
    throw error;
  }
};

export const rejectTransaction = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.put(
      `${API_BASE_URL}/api/transaction/reject/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    throw error;
  }
};

export const anchorTransaction = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.post(
      `${API_BASE_URL}/api/transaction/anchor/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error anchoring transaction:", error);
    throw error;
  }
};

