import headerConfig from "../utils/headerConfig";
import setAuthToken from "../utils/headerConfig";
import axios from 'axios';

const addToCartAPI = async (data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post('http://localhost:5000/api/store/cart', JSON.stringify(data), headerConfig);
}

const getCartAPI = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/store/cart', headerConfig);
}

const removeItemFromCartAPI = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get(`http://localhost:5000/api/store/cart/${id}`, headerConfig);
}

export const cartAPI = {
    addToCartAPI,
    getCartAPI,
    removeItemFromCartAPI
};