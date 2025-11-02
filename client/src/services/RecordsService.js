import axios from "axios";

export const listServiceRecords = async (vehicleId) => {
  const params = vehicleId ? { vehicleId } : {};
  const res = await axios.get(`http://localhost:3001/api/records/service`, { params });
  return res.data;
};

export const createServiceRecord = async (payload) => {
  const res = await axios.post(`http://localhost:3001/api/records/service`, payload);
  return res.data;
};

export const deleteServiceRecord = async (recordId) => {
  const res = await axios.delete(`http://localhost:3001/api/records/service/${recordId}`);
  return res.data;
};

export const acceptServiceRecord = async (recordId) => {
  const res = await axios.post(`http://localhost:3001/api/records/service/${recordId}/accept`);
  return res.data;
};


