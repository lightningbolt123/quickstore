import Header from '../layout/Header';

const Banks = () => {
    const cards = [
        {
            iban: "GB33BUKB20201555555555",
            cardnumber: "4242424242424242",
            cardtype: "visa",
            cvv: "721",
            expirydate: "02/25",
            balance: "10000",
            currency: "USD"
        },
        {
            iban: "DE89370400440532013000",
            cardnumber: "4000056655665556",
            cardtype: "visa_debit",
            cvv: "637",
            expirydate: "06/23",
            balance: "15000",
            currency: "USD"
        },
        {
            iban: "DE62370400440532013001",
            cardnumber: "5555555555554444",
            cardtype: "mastercard",
            cvv: "468",
            expirydate: "07/24",
            balance: "20000",
            currency: "USD"
        },
        {
            iban: "DE89370400440532013002",
            cardnumber: "5200828282828210",
            cardtype: "mastercard_debit",
            cvv: "551",
            expirydate: "10/26",
            balance: "25000",
            currency: "USD"
        }
    ];

    return (
        <div style={{ overflowX: 'scroll', overflowY: 'auto', marginTop: '10px' }} className='cart'>
            <Header text='Test bank accounts and cards' />
            <table>
                <thead>
                    <tr>
                        <th>Serial #</th>
                        <th>IBAN</th>
                        <th>Card number</th>
                        <th>Card type</th>
                        <th>CVV</th>
                        <th>Balance</th>
                        <th>Currency</th>
                        <th>Expiry date</th>
                    </tr>
                </thead>
                <tbody>
                    {cards && cards.map((card, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{card.iban}</td>
                            <td>{card.cardnumber}</td>
                            <td>{card.cardtype}</td>
                            <td>{card.cvv}</td>
                            <td>{card.balance}</td>
                            <td>{card.currency}</td>
                            <td>{card.expirydate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Banks;