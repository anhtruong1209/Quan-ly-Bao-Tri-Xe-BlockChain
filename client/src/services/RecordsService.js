import { axiosJWT } from "./UserService";
import { isJsonString } from "../utils";
import { getApiUrl } from "../config/api";

const getToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    // Kiểm tra xem token có phải là JSON string không
    if (isJsonString(token)) {
      return JSON.parse(token);
    }
    return token;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

export const listServiceRecords = async (vehicleId, status) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const params = {};
    if (vehicleId) params.vehicleId = vehicleId;
    if (status) params.status = status;
    const res = await axiosJWT.get(getApiUrl('/api/records/service'), {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error listing service records:", error);
    throw error;
  }
};

export const createServiceRecord = async (payload) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.post(getApiUrl('/api/records/service'), payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating service record:", error);
    // Nếu lỗi token, có thể token đã hết hạn
    if (error?.response?.data?.message?.includes("token") || error?.response?.status === 401) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

export const deleteServiceRecord = async (recordId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.delete(getApiUrl(`/api/records/service/${recordId}`), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting service record:", error);
    throw error;
  }
};

export const acceptServiceRecord = async (recordId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.post(
      getApiUrl(`/api/records/service/${recordId}/accept`),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error accepting service record:", error);
    throw error;
  }
};

// Admin: Lấy danh sách service records chờ duyệt
export const getPendingServiceRecords = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.get(getApiUrl('/api/records/service/pending'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting pending service records:", error);
    throw error;
  }
};

// Admin: Duyệt service record
export const approveServiceRecord = async (id, garage) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.put(
      getApiUrl(`/api/records/service/${id}/approve`),
      { garage }, // Gửi garage trong body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error approving service record:", error);
    throw error;
  }
};

// Admin: Từ chối service record
export const rejectServiceRecord = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.put(
      getApiUrl(`/api/records/service/${id}/reject`),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error rejecting service record:", error);
    throw error;
  }
};

// User: Cập nhật payment hash sau khi thanh toán
export const updatePayment = async (id, paymentData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
    }
    const res = await axiosJWT.put(
      getApiUrl(`/api/records/service/${id}/payment`),
      {
        paymentHash: paymentData.transactionHash,
        blockNumber: paymentData.blockNumber,
        paymentStatus: "paid",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};


