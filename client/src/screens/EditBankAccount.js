import { useState, useEffect } from 'react';
import Button from '../components/layout/Button';
import Header from '../components/layout/Header';
import FormAlert from '../components/layout/FormAlert';
import { faCheck, faUser, faBank, faCreditCard, faUpload, faEdit } from '@fortawesome/free-solid-svg-icons';
import InputField from '../components/layout/InputField';

const EditBankAccount = () => {
    const [ formData, setFormData ] = useState({
        accountname: '',
        bankname: '',
        accountiban: '',
        cardnumber: ''
    });

    const getError = (name) => {
        // const findError = errors.filter(error => error.param === name);
        // if (findError.length > 0) {
        //     const error = errors.find(error => error.param === name);
        //     return error;
        // }
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

    return (
        <form className='dashboard-form'>
            <Header text='Edit bank account' />
            <InputField label='Account name' type='text' name='accountname' value={accountname} error={getError('accountname')} changeHandler={onChange} icon={faUser} />
            <InputField label='Bank name' type='text' name='bankname' value={bankname} error={getError('bankname')} changeHandler={onChange} icon={faBank} />
            <InputField label='IBAN' type='text' name='accountiban' value={accountiban} error={getError('accountiban')} changeHandler={onChange} icon={faCreditCard} />
            <InputField label='Card number' type='text' name='cardnumber' value={cardnumber} error={getError('cardnumber')} changeHandler={onChange} icon={faCreditCard} />
            <Button text='update' color='button-blue' icon={faEdit} />
        </form>
    )
}

export default EditBankAccount;