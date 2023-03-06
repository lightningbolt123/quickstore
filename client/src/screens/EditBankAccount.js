import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/layout/Button';
import Header from '../components/layout/Header';
import FormAlert from '../components/layout/FormAlert';
import { faUser, faBank, faCreditCard, faEdit } from '@fortawesome/free-solid-svg-icons';
import InputField from '../components/layout/InputField';
import { useSelector, useDispatch } from 'react-redux';
import { getBankAccount, editBankAccount, clearBankMessages } from '../reducers/bankSlice';

const EditBankAccount = () => {
    const [ formData, setFormData ] = useState({
        accountname: '',
        bankname: '',
        accountiban: '',
        cardnumber: ''
    });

    const { bankAccount, message, errors } = useSelector(state => state.bank);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getBankAccount(id));
    },[dispatch, id]);

    useEffect(() => {
        setFormData({
            accountname: bankAccount.accountname ? bankAccount.accountname : '',
            bankname: bankAccount.bankname ? bankAccount.bankname : '',
            accountiban: bankAccount.accountiban ? bankAccount.accountiban : '',
            cardnumber: bankAccount.cardnumber ? bankAccount.cardnumber : ''
        });
    },[bankAccount]);

    useEffect(() => {
        if (message.status || errors.length > 0) {
            setTimeout(() => {
                dispatch(clearBankMessages());
            }, 5000);
        }
    },[message, errors, dispatch]);

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
        
        const newFormData = {
            id,
            data: formData
        }
        dispatch(editBankAccount(newFormData));
        // console.log(JSON.stringify(formData));
    }

    return (
        <form onSubmit={(e) => onSubmit(e)} className='dashboard-form'>
            <Header text='Edit bank account' />
            {JSON.stringify(message) !== '{}' ? (<FormAlert alert={message} />) : ''}
            <InputField label='Account name' type='text' name='accountname' value={accountname} error={getError('accountname')} changeHandler={onChange} icon={faUser} />
            <InputField label='Bank name' type='text' name='bankname' value={bankname} error={getError('bankname')} changeHandler={onChange} icon={faBank} />
            <InputField label='IBAN' type='text' name='accountiban' value={accountiban} error={getError('accountiban')} changeHandler={onChange} icon={faCreditCard} />
            <InputField label='Card number' type='text' name='cardnumber' value={cardnumber} error={getError('cardnumber')} changeHandler={onChange} icon={faCreditCard} />
            <Button text='update' color='button-blue' icon={faEdit} />
        </form>
    )
}

export default EditBankAccount;