import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

export const placeOrder = (data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post('http://localhost:5000/api/orders', JSON.stringify(data), headerConfig);
}

export const getInvoices = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/orders/purchasehistory', headerConfig);
}

export const getOrders = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/orders/purchasehistory', headerConfig);
}

export const getInvoice = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get(`http://localhost:5000/api/orders/invoice/${id}`);
}

export const updateInvoiceStatus = (id, item_id, data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.put(`http://localhost:5000/api/orders/${id}/${item_id}`, JSON.stringify(data), headerConfig);
}

export const orderAPI = {
    placeOrder,
    getInvoices,
    getInvoice,
    getOrders,
    updateInvoiceStatus
}