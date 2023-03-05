import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

export const getWishlist = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/store/mywishlist/', headerConfig);
}

export const addItemToWishlist = (data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post('http://localhost:5000/api/store/mywishlist/', JSON.stringify(data), headerConfig);
}

export const removeItemFromWishlist = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.delete(`http://localhost:5000/api/store/mywishlist/${id}`, headerConfig);
}

export const wishlistAPI = {
    getWishlist,
    addItemToWishlist,
    removeItemFromWishlist
}