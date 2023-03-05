import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const getWalletBalance = () => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.get('http://localhost:5000/api/wallet/', headerConfig);
}

const withdrawFundFromWallet = (data) => {
    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
    }
    return axios.post('http://localhost:5000/api/wallet/', JSON.stringify(data), headerConfig);
}

export const walletAPI = {
    getWalletBalance,
    withdrawFundFromWallet
}