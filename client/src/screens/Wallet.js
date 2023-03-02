import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';

const Wallet = () => {
    return (
        <div style={{ overflowX: 'scroll', overflowY: 'auto', marginTop: '10px' }} className='invoice'>
            <Header text='Wallet' />
        </div>
    )
}

export default Wallet;