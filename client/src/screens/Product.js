import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../reducers/productSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCartShopping, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Product = () => {
    const [ pictureIndex, setPictureIndex ] = useState(0);
    const [ start, setStart ] = useState(0);
    const [ end, setEnd ] = useState(2);
    const { id } = useParams();
    const { loading, product, msg } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    const slideForward = (e) => {
        const length = product.product_images.length
        if (start >= 0 && end < length) {
            setStart(current => current + 1);
            setEnd(present => present + 1);
        }
    }

    const slideBackward = (e) => {
        const length = product.product_images.length
        if (start > 0 || end === length) {
            setStart(current => current - 1);
            setEnd(present => present - 1);
        }
    }

    const setPictureInFrame = (e, imageId) => {
        const images = product.product_images;
        const setCurrentImage = images.filter((image, index) => {
            if (image.public_id === imageId) {
                setPictureIndex(index);
            }
        });
    }

    useEffect(() => {
        dispatch(getProduct(id));
    }, [dispatch]);

    if (loading) return <p>Loading...</p>
    return (
        <div className='product-box'>
            <div style={{ marginLeft: '0px', marginRight: '10px' }}>
                {product.product_images && <img src={product.product_images[pictureIndex].secure_url} alt='product image' className='product-image' />}<br />
                <div>
                    <FontAwesomeIcon style={{  marginBottom: '35px' }} className='icon-style' onClick={(e) => slideBackward(e)} icon={faChevronLeft} size='2x' />
                    {product.product_images && product.product_images.slice(start, end).map(image => (
                        <img key={image.public_id} src={image.secure_url} className='image-thumbnail' alt='product thumbnail' style={{ marginRight: '10px' }} onClick={(e) => setPictureInFrame(e, image.public_id)} />
                    ))}
                    <FontAwesomeIcon style={{  marginBottom: '35px' }}  className='icon-style' onClick={(e) => slideForward(e)} icon={faChevronRight} size='2x' />
                </div>
            </div>
            <div className='product-content'>
                <div style={{ width: '100%' }}>
                    <p style={{ textAlign: 'left', fontSize: '32px' }}>{product.product_name}</p>
                    <p style={{ textAlign: 'left' }}>{product.product_description}</p>
                    {product.product_features && product.product_features.map((feature) => (
                        <p key={feature.id} style={{ textAlign: 'left' }}><FontAwesomeIcon style={{ backgroundColor: 'inherit' }} icon={faCheck} />{' '}{feature.text}</p>
                    ))}
                    <p style={{ float: 'left' }}><span style={{ fontSize: '26px', backgroundColor: 'inherit' }}>${product.new_price}</span><br />
                        <span style={{ textDecoration: 'line-through', color: '#806c63' }}>${product.product_price}</span><br />
                        <span>-{product.product_discount}%</span><br />
                    </p>
                </div>
                {product.product_specifications && (
                    <div style={{ overflowX: 'scroll',overflowY: 'auto', width: '100%' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Color</th>
                                    <th>Skin</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{product.product_specifications.size}</td>
                                    <td>{product.product_specifications.color}</td>
                                    <td>{product.product_specifications.skin}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                <button className='button-orange' style={{ float: 'left' }}>Add to cart{' '}<FontAwesomeIcon style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} icon={faCartShopping} /></button>
            </div>
        </div>
    )
}

export default Product;