import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8000/";


export const getProduits = async () => {
  const response = await axiosInstance.get(`${API_URL}produits/`);
  return response.data;
};
  export const getProduit = async (id) => {
    const response = await axiosInstance.get(`${API_URL}produits/${id}`);
    return response.data;
  };
export const getCategories = async () => {
  const response = await axiosInstance.get(`${API_URL}categories/`);
  return response.data;
};
export const getClients = async () => {
  const response = await axiosInstance.get(`${API_URL}clients/`);
  return response.data;
};
export const getClient = async (id) => {
  const response = await axiosInstance.get(`${API_URL}clients/${id}`);
  return response.data;
};
export const getFournisseurs = async () => {
  const response = await axiosInstance.get(`${API_URL}fournisseurs/`);
  return response.data;
};
export const getFournisseur = async (id) => {
  const response = await axiosInstance.get(`${API_URL}fournisseurs/${id}`);
  return response.data;
};
export const getMouvements = async () => {
  const response = await axiosInstance.get(`${API_URL}mouvements/`);
  return response.data;
};
export const getCommandesClient = async () => {
  const response = await axiosInstance.get(`${API_URL}commandesClient/`);
  return response.data;
};
export const getCommandeClient = async (id) => {
  const response = await axiosInstance.get(`${API_URL}commandesClient/${id}`);
  return response.data;
};
export const getCommandesFournisseur = async () => {
  const response = await axiosInstance.get(`${API_URL}commandesFournisseur/`);
  return response.data;
};
export const getCommandeFournisseur = async (id) => {
  const response = await axiosInstance.get(`${API_URL}commandesFournisseur/${id}`);
  return response.data;
};
export const getUsers = async () => {
  const response = await axiosInstance.get(`${API_URL}gerants/`);
  return response.data;
};