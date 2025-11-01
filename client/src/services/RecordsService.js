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


