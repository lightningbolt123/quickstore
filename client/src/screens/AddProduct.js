import { useEffect, useState, Fragment } from 'react';
import Button from '../components/layout/Button';
import InputField from '../components/layout/InputField';
import Header from '../components/layout/Header';
import SmallButton from '../components/layout/SmallButton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormAlert from '../components/layout/FormAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faFileText, faFilter,faDollar, faTag, faList, faListCheck, faPlusCircle, faMinusCircle, faImages, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createProduct } from '../reducers/productSlice';
import { clearProductMessages } from '../reducers/productSlice';
import { v4 as uuidv4 } from 'uuid';

const AddProduct = () => {
    const [ formData, setFormData ] = useState({
        name: '',
        description: '',
        price: '',
        discount: ''
    });
    const [ featuresArray, setFeaturesArray ] = useState([]);
    const [ specificationsObject, setSpecificationsObject ] = useState({
        size: '',
        color: '',
        skin: ''
    });
    const [ photoImages, setPhotoImages ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState('');

    const { msg, errors } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { size, color, skin } = specificationsObject;
    const {
        name,
        description,
        price,
        discount
    } = formData;

    const categories = [
        'Men_Clothing',
        'Women_Clothing',
        'Men_Shoes',
        'Women_Shoes',
        'Men_Bags',
        'Women_Bags',
        'Men_Accessories',
        'Women_Accessories',
        'Men_Watches',
        'Women_Watches',
        'Men_Jewelries',
        'Women_Jewelries',
        'Beds,Frames&Bases',
        'Dressers',
        'Nightstands',
        'Kids_Beds&Headboards',
        'Armoires',
        'Coffee_Tables',
        'Tables',
        'Futons&Sofa_Beds',
        'Cabinets&Chests',
        'Office_Chairs',
        'Desks',
        'Bookcases',
        'File_Cabinets',
        'Breakroom_Tables',
        'Dining_Sets',
        'Kitchen_Storage_Cabinets',
        'Bashers_Racks',
        'Dining_Chairs',
        'Dining_Room_Tables',
        'Bar_Stools',
        'Desktop_Computers',
        'Monitors',
        'Laptops',
        'Hard_Drives&Storage',
        'Computer_Accessories',
        'TVs',
        'Home_Audio_Speakers',
        'Projectors',
        'Media_Streaming_Devices',
        'Digital_SLR_Cameras',
        'Sports&Action_Cameras',
        'Camera_Lenses',
        'Photo_Printer',
        'Digital_Memory_Cards',
        'Carrier_Phones',
        'Unlocked_Phones',
        'Phone&Cellphone_Cases',
        'Cellphone_Chargers',
        'Sofas&Couches',
        'Arm_Chairs',
        'Bed_Frames',
        'Beside_Tables',
        'Dressing_Tables',
        'Light_Bulbs',
        'Lamps',
        'Celling_Lights',
        'Wall_Lights',
        'Bathroom_Lighting',
        'Decorative_Accessories',
        'Candals&Holders',
        'Home_Fragrance',
        'Mirrors',
        'Clocks',
        'Garden_Furniture',
        'Lawn_Mowers',
        'Pressure_Washers',
        'All_Garden_Tools',
        'Outdoor_Dining', 
        'Health&Beauty',
        'Gift_Ideas',
        'Toy&Games',
        'Cooking',
        'Phones&Tablets',
        'Phone_Accessories'
    ];

    useEffect(() => {
        setSelectedOption(selectedOption);
        if (msg.status_code === '201') {
            setTimeout(() => {
                dispatch(clearProductMessages());
            },2000);
            setTimeout(() => {
                navigate("/store");
            },3000);
        }
        if (errors) {
            setTimeout(() => {
                dispatch(clearProductMessages()); 
            },7000);
        }
    },[selectedOption, msg, errors]);

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
        const featureIndex = featuresArray.length + 1;
        feature.id = uuidv4();
        feature.text = '';
        featuresArray.push(feature);
        setFeaturesArray([...featuresArray]);
    }

    const featureOnChange = (e, id) => {
        const feature = featuresArray.find(feature => feature.id === id);
        feature.text = e.target.value;
        featuresArray.filter((item) => item.id === id ? item = feature : item);
        setFeaturesArray([...featuresArray]);
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
            images: photoImages
        };
        // if (featuresArray) data.features = featuresArray;
        // if (photoImages.length === 0) {
        //     return alert('images cannot be empty!!!');
        // } else {
        //     data.images = photoImages;
        // }
        const result = dispatch(createProduct(data));
        if (result) {
            console.log(msg);
        }
        console.log(data);
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Fill in your product details' />
            {JSON.stringify(msg) !== '{}' ? (<FormAlert alert={msg} />) : ''}
            <InputField label='Name' type='text' name='name' value={name} error={getError('name')} changeHandler={onChange} icon={faCartShopping} />
            <InputField label='Description' type='text' name='description' value={description} error={getError('name')} changeHandler={onChange} icon={faFileText} />
            <InputField label='Price' type='number' name='price' value={price} error={getError('name')} changeHandler={onChange} icon={faDollar} />
            <InputField label='Discount(%)' type='number' name='discount' value={discount} error={getError('name')} changeHandler={onChange} icon={faTag} />
            
            <span className='medium-text'>Category</span>
            <div className='store-details-container'>
                <select name='selectedOption' onChange={(e) => handleSelectOption(e)} style={{ marginTop: '10px', width: '100%', height: '50px' }}>
                <option value='' disabled selected hidden>--Select an option--</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
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
                        <img src={item.photo} style={{ width: '90%', height: '250px', borderRadius: '10px', opacity: '1.0' }} /><br />
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

export default AddProduct;