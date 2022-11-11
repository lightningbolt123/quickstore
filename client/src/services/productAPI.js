import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const fetchProducts = async () => {
    return axios.get('http://localhost:5000/api/store/products/all', headerConfig);
}

const fetchProduct = async (id) => {
    return axios.get(`http://localhost:5000/api/store/products/all/${id}`);
}

export const productAPI = {
    fetchProducts,
    fetchProduct
};