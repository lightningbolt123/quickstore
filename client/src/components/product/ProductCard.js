import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product: { id, product_images, product_name, product_price }}) => {
    return (
        <Link to={`products/${id}`} className='product-card'>
            <img alt='Text' src={product_images[0].secure_url} className='product-card-image' />
            <p>{product_name.slice(0, 20)}...</p>
            <b>${product_price}</b>
        </Link>
    )
}

export default ProductCard;