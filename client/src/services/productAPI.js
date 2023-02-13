import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const fetchProducts = async () => {
    return axios.get('http://localhost:5000/api/store/products/all', headerConfig);
}

const fetchProduct = async (id) => {
    return axios.get(`http://localhost:5000/api/store/products/all/${id}`, headerConfig);
}

const createProduct = async (data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post('http://localhost:5000/api/store/products/all', JSON.stringify(data), headerConfig);
}

const fetchStoreProducts = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get(`http://localhost:5000/api/store/products/vendors/${id}`, headerConfig);
}

const updateProduct = async (id, data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.put(`http://localhost:5000/api/store/products/all/${id}`, JSON.stringify(data),headerConfig);
}

const addProductImage = async (id, data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post(`http://localhost:5000/api/store/products/photo/${id}`, JSON.stringify({ photos: data }), headerConfig);
}

const deleteProductImage = async (id, publicId) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.delete(`http://localhost:5000/api/store/products/${id}/photo?public_id=${publicId}`, headerConfig);
}

const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.delete(`http://localhost:5000/api/store/products/all/${id}`, headerConfig);
}

export const productAPI = {
    fetchProducts,
    fetchProduct,
    createProduct,
    fetchStoreProducts,
    updateProduct,
    addProductImage,
    deleteProductImage,
    deleteProduct
};