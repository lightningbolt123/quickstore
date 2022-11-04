import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const fetchProducts = async () => {
    return axios.get('http://localhost:5000/api/store/products/all', headerConfig);
}

const fetchProduct = async (id) => {
    return axios.get(`http://localhost:5000/api/store/products/all/${id}`);
}

const fetchAllStores = async () => {
    return axios.get('http://localhost:5000/api/store/all');
}

const fetchStore = async (id) => {
    return axios.get(`http://localhost:5000/api/store/all/${id}`);
}

const fetchLoggedInUserStore = async () => {
    setAuthToken();
    return axios.get('http://localhost:5000/api/store/mystore');
}

const createAndUpdateStore = async () => {
    setAuthToken();
    return axios.post('http://localhost:5000/api/store');
}

export const productAPI = {
    fetchProducts,
    fetchProduct,
    fetchAllStores,
    fetchStore,
    fetchLoggedInUserStore,
    createAndUpdateStore
};