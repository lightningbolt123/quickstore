import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const fetchAllStores = async () => {
    return axios.get('http://localhost:5000/api/store/all', headerConfig);
}

const fetchStore = async (id) => {
    return axios.get(`http://localhost:5000/api/store/all/${id}`, headerConfig);
}

const getLoggedInUserStore = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/store/mystore', headerConfig);
}

const createAndUpdateStore = async () => {
    setAuthToken();
    return axios.post('http://localhost:5000/api/store', headerConfig);
}

export const storeAPI = {
    fetchAllStores,
    fetchStore,
    getLoggedInUserStore,
    createAndUpdateStore
};