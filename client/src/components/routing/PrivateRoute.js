import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isAsyncThunkAction } from '@reduxjs/toolkit';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ component: Component }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.auth);
    if (loading) return <Spinner />
    if (isAuthenticated) return <Component />
    return <Navigate to='/login' />
}

export default PrivateRoute;