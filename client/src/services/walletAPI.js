import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const getBankAccounts = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/bank/', headerConfig);
}

const getBankAccount = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get(`http://localhost:5000/api/bank/${id}`, headerConfig);
}

const addBankAccount = (data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post('http://localhost:5000/api/bank/', JSON.stringify(data), headerConfig);
}

const editBankAccount = (accountData) => {
    const { id, data } = accountData;
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.put(`http://localhost:5000/api/bank/${id}`, JSON.stringify(data), headerConfig);
}

const deleteBank = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.delete(`http://localhost:5000/api/bank/${id}`, headerConfig);
}

export const walletAPI = {
    getBankAccounts,
    getBankAccount,
    addBankAccount,
    editBankAccount,
    deleteBank
}