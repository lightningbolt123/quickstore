import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Signupform from '../components/auth/Signupform';
import { signupUser, verifyUser } from '../reducers/authSlice';

const Signup = () => {
    const dispatch = useDispatch();
    const { message, loading, user, errors } = useSelector((state) => state.auth);

    return (<Signupform />)
}

export default Signup;