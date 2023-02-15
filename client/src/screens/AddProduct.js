import { useEffect, useState, Fragment } from 'react';
import Button from '../components/layout/Button';
import InputField from '../components/layout/InputField';
import Header from '../components/layout/Header';
import SmallButton from '../components/layout/SmallButton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormAlert from '../components/layout/FormAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faFileText, faDollar, faTag, faPlusCircle, faMinusCircle, faImages, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createProduct } from '../reducers/productSlice';
import { clearProductMessages } from '../reducers/productSlice';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../utils/staticVariables';

const AddProduct = () => {
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

    const { msg, errors, loading } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { size, color, skin } = specificationsObject;
    const {
        name,
        description,
        price,
        discount,
        quantity
    } = formData;

    useEffect(() => {
        setSelectedOption(selectedOption);

        if (msg.status_code === '200') {
            dispatch(clearProductMessages());
        } else if (msg.status_code === '201') {
            setTimeout(() => {
                navigate("/store");
            }, 2000);
            setTimeout(() => {
                navigate("/store");
            },3000);
        }

        if (errors.length > 0) {
            setTimeout(() => {
                dispatch(clearProductMessages());
            },5000)
        }
    },[dispatch, navigate, selectedOption, msg, errors]);

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
        const data = {
            name,
            description,
            price,
            discount,
            specifications: specificationsObject,
            category: selectedOption,
            features: featuresArray,
            images: photoImages,
            quantity
        };
        // if (featuresArray) data.features = featuresArray;
        // if (photoImages.length === 0) {
        //     return alert('images cannot be empty!!!');
        // } else {
        //     data.images = photoImages;
        // }
        const result = dispatch(createProduct(data));
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Fill in your product details' />
            {JSON.stringify(msg) !== '{}' ? (<FormAlert alert={msg} />) : ''}
            <InputField label='Name' type='text' name='name' value={name} error={getError('name')} changeHandler={onChange} icon={faCartShopping} />
            <InputField label='Description' type='text' name='description' value={description} error={getError('description')} changeHandler={onChange} icon={faFileText} />
            <InputField label='Price' type='number' name='price' value={price} error={getError('price')} changeHandler={onChange} icon={faDollar} />
            <InputField label='Discount(%)' type='number' name='discount' value={discount} error={getError('discount')} changeHandler={onChange} icon={faTag} />
            <InputField label='Quantity' type='number' name='quantity' value={quantity} error={getError('quantity')} changeHandler={onChange} icon={faTag} />
            
            <span className='medium-text'>Category</span>
            <div className='store-details-container'>
                <select name='selectedOption' onChange={(e) => handleSelectOption(e)} style={{ marginTop: '10px', width: '100%', height: '50px' }}>
                <option value='' disabled hidden>--Select an option--</option>
                    {categories.map((category, index) => (
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
            {featuresArray.map(item => (
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
            
            <Button text='SUBMIT' loading={loading} icon={faCheck} />

            
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

export default AddProduct;