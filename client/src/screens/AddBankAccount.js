import { useState, useEffect } from 'react';
import Button from '../components/layout/Button';
import Header from '../components/layout/Header';
import FormAlert from '../components/layout/FormAlert';
import { faUser, faBank, faCreditCard, faUpload } from '@fortawesome/free-solid-svg-icons';
import InputField from '../components/layout/InputField';
import { useSelector, useDispatch } from 'react-redux';
import { addBankAccount, clearBankMessages } from '../reducers/bankSlice';

const AddBankAccount = () => {
    const [ formData, setFormData ] = useState({
        accountname: '',
        bankname: '',
        accountiban: '',
        cardnumber: ''
    });
    const { message, errors } = useSelector(state => state.bank);
    const dispatch = useDispatch();

    useEffect(() => {
        if (message.status_code === '201' || errors.length > 0) {
            setTimeout(() => {
                dispatch(clearBankMessages());
                setFormData({
                    accountname: '',
                    bankname: '',
                    accountiban: '',
                    cardnumber: ''
                });
            }, 5000);
        }
    },[message]);
    
    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const {
        accountname,
        bankname,
        accountiban,
        cardnumber
    } = formData;

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(addBankAccount(formData));
        // console.log(formData);
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Add bank account' />
            {JSON.stringify(message) !== '{}' ? (<FormAlert alert={message} />) : ''}
            <InputField label='Account name' type='text' name='accountname' value={accountname} error={getError('accountname')} changeHandler={onChange} icon={faUser} />
            <InputField label='Bank name' type='text' name='bankname' value={bankname} error={getError('bankname')} changeHandler={onChange} icon={faBank} />
            <InputField label='IBAN' type='text' name='accountiban' value={accountiban} error={getError('accountiban')} changeHandler={onChange} icon={faCreditCard} />
            <InputField label='Card number' type='text' name='cardnumber' value={cardnumber} error={getError('cardnumber')} changeHandler={onChange} icon={faCreditCard} />
            <Button text='add' icon={faUpload} />
        </form>
    )
}

export default AddBankAccount;