import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Button from '../components/layout/Button';
import SmallButton from '../components/layout/SmallButton';
import { faMoneyBill, faMoneyBillTransfer, faPlus } from '@fortawesome/free-solid-svg-icons';

const Wallet = () => {
    return (
        <Fragment>
            <div style={{ marginTop: '10px' }} className='invoice'>
                <Header text='Wallet' />
                <div style={{ marginTop: '10px' }}>
                    <p><span style={{ fontSize: '20px' }}>Available balance $0</span></p>
                    <p><span style={{ fontSize: '20px' }}>Ledger balance $0</span></p>
                </div>
                <Button text='Withdraw funds' color='button-blue' icon={faMoneyBillTransfer}/>
            </div>
            <div style={{ overflowX: 'scroll', overflowY: 'auto', marginTop: '10px' }} className='invoice'>
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
                            <th>Account name</th>
                            <th>IBAN</th>
                            <th>Card number</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default Wallet;