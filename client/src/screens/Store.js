import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreCard from '../components/store/StoreCard';
import UploadedProducts from '../components/product/UploadedProducts';
import { fetchLoggedInUserStore } from '../reducers/storeSlice';
import Spinner from '../components/layout/Spinner';

const Store = () => {
    const dispatch = useDispatch();
    const { store, loading, photoLoading, msg } = useSelector((state) => state.store);

    useEffect(() => {
        if (!store) {
            dispatch(fetchLoggedInUserStore());
        }
    },[dispatch, store]);

    if (loading) return <Spinner />;
    return (
        <div>
            <StoreCard store={store} message={msg} loading={photoLoading} />
            <UploadedProducts />
        </div>
    )
}

export default Store;