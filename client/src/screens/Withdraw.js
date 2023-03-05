import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/layout/Button';
import Header from '../components/layout/Header';
import FormAlert from '../components/layout/FormAlert';
import { faMoneyBillTransfer, faCalculator } from '@fortawesome/free-solid-svg-icons';
import InputField from '../components/layout/InputField';
import { getBankAccounts } from '../reducers/bankSlice';
import { withdrawFunds, clearWalletErrors, clearWalletMessage } from '../reducers/walletSlice';

const Withdraw = () => {
    const [ amount, setAmount ] = useState(0);
    const [ IBAN, setIBAN ] = useState('');
    const [ accountname, setAccountname ] = useState('');
    const { errors, walletMessage } = useSelector(state => state.wallet);
    const { bankAccounts } = useSelector(state => state.bank);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBankAccounts());
    },[dispatch]);

    useEffect(() => {
        if (JSON.stringify(walletMessage) !== '{}') {
            setTimeout(() => {
                dispatch(clearWalletMessage());
            }, 3000);
        }
        if (errors.length > 0) {
            setTimeout(() => {
                dispatch(clearWalletErrors());
            }, 3000);
        }
    },[dispatch, walletMessage, errors]);

    useEffect(() => {
        if (IBAN !== '') {
            const account = bankAccounts.find(bankAccount => bankAccount.accountiban === IBAN);
            setAccountname(account.accountname);
        }
    },[IBAN, bankAccounts]);

    const getError = (name) => {
        const findError = errors.filter(error => error.param === name);
        if (findError.length > 0) {
            const error = errors.find(error => error.param === name);
            return error;
        }
    }

    const onChange = (e) => {
        setAmount(e.target.value);
    }

    const handleSelectedIBAN = (e) => {
        e.preventDefault();
        setIBAN(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (parseFloat(amount) >= 10) {
            const data = {
                amount,
                accountname,
                accountiban: IBAN
            }
            dispatch(withdrawFunds(data));
        } else {
            alert('You cannot transfer less than $10.');
        }
    }

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <Header text='Withdraw' />
            {JSON.stringify(walletMessage) !== '{}' ? (<FormAlert alert={walletMessage} />) : ''}
            <InputField label='Amount' type='number' name='amount' value={amount} error={getError('accountname')} changeHandler={onChange} icon={faCalculator} /><br />
            <label htmlFor='banks' style={{ float: 'left' }}>Bank</label><br />
            <select id='banks' name='IBAN' onChange={(e) => handleSelectedIBAN(e)} style={{ marginTop: '10px', width: '100%', height: '50px' }}>
                <option value=''>-- select bank account --</option>
                {bankAccounts.map(bankAccount => (
                    <option key={bankAccount._id} value={bankAccount.accountiban}>{bankAccount.bankname}</option>
                ))}
            </select>
            <Button text='transfer' icon={faMoneyBillTransfer} />
        </form>
    )
}

export default Withdraw;