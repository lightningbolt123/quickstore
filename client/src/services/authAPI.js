import axios from 'axios';
import headerConfig from '../utils/headerConfig';
import setAuthToken from '../utils/setAuthToken';

const signupUser = async (data) => {
    return axios.post('http://localhost:5000/api/users', JSON.stringify(data), headerConfig);
};

const verifyUser = async (data) => {
    return axios.post('http://localhost:5000/api/users/verifyaccount', JSON.stringify(data), headerConfig)
}

const resendOtp = async (data) => {
    return axios.post('http://localhost:5000/api/users/resend_otp', JSON.stringify(data), headerConfig);
}

const retrievePassword = async (data) => {
    return axios.post('http://localhost:5000/api/users/retrieve_password', JSON.stringify(data), headerConfig);
}

const generateToken = async (data) => {
    return axios.post('http://localhost:5000/api/users/generatetoken', JSON.stringify(data), headerConfig);
}

const createNewPassword = async (token, data) => {
    return axios.post(`http://localhost:5000/api/users/newpassword/${token}`, JSON.stringify(data), headerConfig);
}

const loginUser = async (data) => {
    return axios.post('http://localhost:5000/api/auth', JSON.stringify(data), headerConfig);
};

const loadUser = async () => {
    const token = localStorage.getItem("QuickstoreToken");
    setAuthToken(token)
    return axios.get('http://localhost:5000/api/auth', headerConfig)
};


export const authAPI = {
    signupUser,
    verifyUser,
    resendOtp,
    retrievePassword,
    generateToken,
    createNewPassword,
    loginUser,
    loadUser
}