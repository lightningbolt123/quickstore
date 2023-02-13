import { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/layout/Button';
import InputField from '../components/layout/InputField';
import Header from '../components/layout/Header';
import SmallButton from '../components/layout/SmallButton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormAlert from '../components/layout/FormAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faFileText, faDollar, faTag, faPlusCircle, faMinusCircle, faImages, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { updateProduct, addImageToProduct, removeImageFromProduct, getProduct, clearProductMessages } from '../reducers/productSlice';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../utils/staticVariables';

const UpdateProduct = () => {
    const [ formData, setFormData ] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        quantity: ''
    });
    const [ featuresArray, setFeaturesArray ] = useState([]);
    const [ specificationsObject, setSpecificationsObject ] = useState({
        size: '',
        color: '',
        skin: ''
    });
    const [ photoImages, setPhotoImages ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState('');

    const { msg, errors, product, loading } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { size, color, skin } = specificationsObject;
    const {
        name,
        description,
        price,
        discount,
        quantity
    } = formData;

    useEffect(() => {
        if (JSON.stringify(product) === '{}') {
            dispatch(getProduct(id));
        }

        if (typeof msg !== 'undefined' && msg.status_code === '201') {
            setTimeout(() => {
                dispatch(clearProductMessages());
            }, 3000);
        }

        if (errors.length > 0) {
            setTimeout(() => {
                dispatch(clearProductMessages());
            },5000)
        }
    },[dispatch, navigate, id, selectedOption, msg, product, errors]);

    useEffect(() => {
        if (typeof product !== "undefined") {
            setFormData({
                name: typeof product.product_name !== "undefined" ? product.product_name : '',
                description: typeof product.product_description !== "undefined" ? product.product_description : '',
                price: typeof product.product_price !== "undefined" ? product.product_price : '',
                discount: typeof product.product_discount !== "undefined" ? product.product_discount : '',
                quantity: typeof product.product_quantity !== "undefined" ? product.product_quantity : ''
            });
        }
        if (typeof product.product_features !== "undefined") {
            setFeaturesArray([...product.product_features]);
        }
        if (typeof product.product_category !== "undefined") {
            setSelectedOption(product.product_category);
        }
    },[product]);

    useEffect(() => {
        if (typeof product !== "undefined" && typeof product.product_specifications !== "undefined") {
            setSpecificationsObject({
                size: typeof product.product_specifications !== "undefined" ? product.product_specifications.size : '',
                color: typeof product.product_specifications !== "undefined" ? product.product_specifications.color : '',
                skin: typeof product.product_specifications !== "undefined" ? product.product_specifications.skin : ''
            });
        }
    },[product]);

    const addImage = async (e) => {
       try {
        if (window.FileReader) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                const singleImage = {
                    id: uuidv4(),
                    photo: reader.result
                };
                photoImages.push(singleImage);
                setPhotoImages([...photoImages]);
            }
       }
       } catch (error) {
        if (error) {
            return;
        }
       }
    }

    const removeImage = (e, id) => {
        e.preventDefault();
        const result = photoImages.filter((item) => item.id !== id);
        setPhotoImages([...result]);
    }

    const removeImageFromServer = (e, pId, imgId) => {
        const data = { pId, imgId };
        dispatch(removeImageFromProduct(data));
    }

    const addFeature = (e) => {
        e.preventDefault();
        const feature = {};
        feature.id = uuidv4();
        feature.text = '';
        featuresArray.push(feature);
        setFeaturesArray([...featuresArray]);
    }

    const featureOnChange = (e, id) => {
        const result = featuresArray.map((item) => item.id === id ? {...item, text: e.target.value} : item);
        setFeaturesArray([...result]);
    }

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const removeFeature = (e, id) => {
        e.preventDefault();
        const result = featuresArray.filter((item) => item.id !== id);
        setFeaturesArray([...result]);
    }

    const specOnChange = (e) => {
        setSpecificationsObject({ ...specificationsObject, [e.target.name]:e.target.value});
    }

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }
    
    const handleSelectOption = (e) => {
        setSelectedOption(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        // console.log(selectedOption)
        const data = {
            name,
            description,
            price,
            discount,
            specifications: specificationsObject,
            category: selectedOption,
            features: featuresArray,
            quantity
        };
        if (featuresArray) data.features = featuresArray;
        if (photoImages.length === 0 && product.product_images.length === 0) {
            return alert('images cannot be empty!!!');
        } else if (photoImages.length > 0 && product.product_images.length === 0) {
            dispatch(addImageToProduct({ id: product.id, data: photoImages }));
        } else if (photoImages.length > 0 && product.product_images.length > 0) {
            dispatch(addImageToProduct({ id: product.id, data: photoImages }));
        }
        const result = dispatch(updateProduct({ id: product.id, data }));
        if (result) {
            console.log(msg);
        }
        console.log(data);
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Fill in your product details' />
            {typeof msg !== 'undefined' && JSON.stringify(msg) !== '{}' ? (<FormAlert alert={msg} />) : ''}
            <InputField label='Name' type='text' name='name' value={name} error={getError('name')} changeHandler={onChange} icon={faCartShopping} />
            <InputField label='Description' type='text' name='description' value={description} error={getError('description')} changeHandler={onChange} icon={faFileText} />
            <InputField label='Price' type='number' name='price' value={price} error={getError('price')} changeHandler={onChange} icon={faDollar} />
            <InputField label='Discount(%)' type='number' name='discount' value={discount} error={getError('discount')} changeHandler={onChange} icon={faTag} />
            <InputField label='Quantity' type='number' name='quantity' value={quantity} error={getError('quantity')} changeHandler={onChange} icon={faTag} />
            
            <span className='medium-text'>Category</span>
            <div className='store-details-container'>
                <select name='selectedOption' onChange={(e) => handleSelectOption(e)} style={{ marginTop: '10px', width: '100%', height: '50px' }}>
                    {categories.map((category, index) => category === selectedOption ? (
                        <option key={index} value={selectedOption} selected>{selectedOption.replace('_',' ').replace('&',' and ')}</option>
                    ) : (
                        <option key={index} value={category}>{category.replace('_',' ').replace('&',' and ')}</option>
                    ))}
                </select>
            </div>
            {errors && errors.map(error => error.param === 'category' ? (
                <Fragment>
                    <span style={{ float: 'left', color: 'red' }}>{error.msg}</span><br />
                </Fragment>
            ): '')}
            <br />

            <span className='medium-text'>Features</span>
            {featuresArray.length > 0 && featuresArray.map(item => (
                <div key={item.id} className='store-details-container'>
                    <input type='text' value={item.text} onChange={(e) => featureOnChange(e, item.id)} style={specStyle} className='feature-input-div' placeholder='feature'  />
                    <FontAwesomeIcon icon={faMinusCircle} onClick={(e) => removeFeature(e, item.id)} style={{ marginTop: '15px', color: '#F55050' }} className='clickable-icon-style' size='2x' />                    
                </div>
            ))}
            <SmallButton text='ADD' icon={faPlusCircle} onClickHandler={(e) => addFeature(e)} /><br />

            <span className='medium-text'>Specifications</span>
            <div className='store-details-container'>
                <input type='text' name='size' value={size} onChange={(e) => specOnChange(e)} style={specStyle} className='feature-input-div' placeholder='Size' />
                <input type='text' name='color' value={color} onChange={(e) => specOnChange(e)} style={specStyle} className='feature-input-div' placeholder='Color' />
                <input type='text' name='skin' value={skin} onChange={(e) => specOnChange(e)} style={specStyle} className='feature-input-div' placeholder='Skin' />
            </div>

            <span className='medium-text'>Images</span><br />

            <div className='store-details-container'>
                {typeof product.product_features !== "undefined" && product.product_images.map(item => (
                    <div key={item.public_id} style={{ marginTop: '10px' }} className='store-card-details'>
                        <img src={item.secure_url} style={{ width: '90%', height: '250px', borderRadius: '10px', opacity: '1.0' }} alt='product placeholder' /><br />
                        <FontAwesomeIcon icon={faTrash} onClick={(e) => removeImageFromServer(e, product.id, item.public_id)} style={{ marginTop: '15px', color: '#F55050' }} className='clickable-icon-style' size='2x' />
                    </div>
                ))}
            </div>

            <span className='medium-text'>Add images</span><br />

            <div style={{ textAlign: 'center', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                {errors && errors.map(error => error.param === 'images' ? (
                <Fragment>
                    <span style={{ color: 'red' }}>{error.msg}</span><br />
                </Fragment>) : '')}
            </div>

            <div className='store-details-container'>
                {photoImages.map(item => (
                    <div key={item.id} style={{ marginTop: '10px' }} className='store-card-details'>
                        <img src={item.photo} style={{ width: '90%', height: '250px', borderRadius: '10px', opacity: '1.0' }} alt='product placeholder' /><br />
                        <FontAwesomeIcon icon={faTrash} onClick={(e) => removeImage(e, item.id)} style={{ marginTop: '15px', color: '#F55050' }} className='clickable-icon-style' size='2x' />
                    </div>
                ))}
            </div>

            <label htmlFor='add-image'>
                <FontAwesomeIcon icon={faImages} style={{ marginTop: '10px', color: 'rgba(16, 121, 240, 0.8)' }} className='clickable-icon-style' size='3x' />
            </label>
            <input type='file' id='add-image' onChange={(e) => addImage(e)} style={{ display: 'none' }} />
            
            <Button text='SUBMIT' icon={faCheck} />

            
        </form>
    );
}

const specStyle = {
    backgroundColor: '#e3e6e7',
    marginTop: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px',
    padding: '10px'
}

export default UpdateProduct;