import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Button from '../components/layout/Button';
import SmallButton from '../components/layout/SmallButton';
import { faMoneyBillTransfer, faPlus, faCancel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { getBankAccounts, deleteBankAccount } from '../reducers/bankSlice';
import formatDate from '../utils/formatDate';
import formatTime from '../utils/formatTime';

const Wallet = () => {
    const { bankAccounts } = useSelector(state => state.bank);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBankAccounts());
    },[dispatch]);

    const removeBankAccount = (e, id) => {
        e.preventDefault();
        dispatch(deleteBankAccount(id));
    }

    return (
        <Fragment>
            <div style={{ marginTop: '10px' }} className='order'>
                <Header text='Wallet' />
                <div style={{ marginTop: '10px' }}>
                    <p><span style={{ fontSize: '20px' }}>Available balance $0</span></p>
                    <p><span style={{ fontSize: '20px' }}>Ledger balance $0</span></p>
                </div>
                <SmallButton text='Withdraw funds' icon={faMoneyBillTransfer}/>
            </div>
            <div style={{ overflowX: 'scroll', overflowY: 'auto', marginTop: '10px' }} className='order'>
                <Header text='Bank accounts' />
                <Link className='remove-link-style' to='/add-bank'>
                    <SmallButton text='add account' icon={faPlus} float='right' onClickHandler={() => {}} />
                </Link>
                <table>
                    <thead>
                        <tr>
                            <th> Serial #</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Bank name</th>
                            <th>Account name</th>
                            <th>IBAN</th>
                            <th>Card number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bankAccounts.map((bankAccount, index) => (
                            <tr key={bankAccount._id}>
                                <td>{index + 1}</td>
                                <td>{formatDate(bankAccount.date)}</td>
                                <td>{formatTime(bankAccount.date)}</td>
                                <td>{bankAccount.bankname}</td>
                                <td>{bankAccount.accountname}</td>
                                <td style={{ color: '#1483b8' }}>
                                    <Link className='remove-link-style' to={`/edit-bank/${bankAccount._id}`}>
                                        {bankAccount.accountiban}
                                    </Link>
                                </td>
                                <td>
                                    {bankAccount.cardnumber}
                                    <FontAwesomeIcon onClick={(e) => removeBankAccount(e, bankAccount._id)} style={{ color: '#F55050', marginLeft: '10px' }} className='clickable-icon-style' icon={faCancel} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default Wallet;