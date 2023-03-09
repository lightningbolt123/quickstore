import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreCard from '../components/store/StoreCard';
import UploadedProducts from '../components/product/UploadedProducts';
import { fetchLoggedInUserStore } from '../reducers/storeSlice';
import { clearProductMessages } from '../reducers/productSlice';
import Spinner from '../components/layout/Spinner';

const Store = () => {
    const dispatch = useDispatch();
    const { store, loading, photoLoading, msg } = useSelector((state) => state.store);

    useEffect(() => {
        if (store === null) {
            dispatch(fetchLoggedInUserStore());
        }
        dispatch(clearProductMessages());
    },[dispatch, store]);

    if (loading) return <Spinner />;
    return (
        <div className='store-container'>
            <StoreCard store={store} message={msg} loading={photoLoading} />
            <UploadedProducts storeId={ store ? store.store_id : '' } />
        </div>
    )
}

export default Store;