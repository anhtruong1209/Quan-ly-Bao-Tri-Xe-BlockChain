import axios from "axios";
import { API_BASE_URL, getApiUrl } from "../config/api";

export const axiosJWT = axios.create({
  baseURL: API_BASE_URL,
});

export const loginUser = async (data) => {
  const res = await axios.post(getApiUrl('/api/user/sign-in'), data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(getApiUrl('/api/user/sign-up'), data);
  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      getApiUrl(`/api/user/get-details/${id}`),
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error get detail user: ", error);
    throw error;
  }
};

export const deleteUser = async (id, access_token, data) => {
  const res = await axiosJWT.delete(
    getApiUrl(`/api/user/delete-user/${id}`),
    data,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(getApiUrl('/api/user/getAll'), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

// export const refreshToken = async () => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
//         withCredentials: true
//     })
//     return res.data
// }

export const refreshToken = async (refreshToken) => {
  // console.log("refreshToken", refreshToken);
  const res = await axios.post(
    getApiUrl('/api/user/refresh-token'),
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(getApiUrl('/api/user/log-out'));
  return res.data;
};

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    getApiUrl(`/api/user/update-user/${id}`),
    data,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyUser = async (data, access_token) => {
  const res = await axiosJWT.post(
    getApiUrl('/api/user/delete-many'),
    data,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axios.post(getApiUrl('/api/user/forgot-password'), { email });
  return res.data;
};

export const changePassword = async (userId, oldPassword, newPassword, access_token) => {
  const res = await axiosJWT.post(
    getApiUrl(`/api/user/change-password/${userId}`),
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};