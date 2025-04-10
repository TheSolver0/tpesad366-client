import axios from "axios";

const API_URL = "http://localhost:8000/";

export const getProduits = async () => {
  const response = await axios.get(`${API_URL}produits/`);
  return response.data;
};
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}categories/`);
  return response.data;
};
export const getClients = async () => {
  const response = await axios.get(`${API_URL}clients/`);
  return response.data;
};
export const getFournisseurs = async () => {
  const response = await axios.get(`${API_URL}fournisseurs/`);
  return response.data;
};
export const getMouvements = async () => {
  const response = await axios.get(`${API_URL}mouvements/`);
  return response.data;
};
