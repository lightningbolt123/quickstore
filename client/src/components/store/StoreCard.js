import PropTypes from 'prop-types';

const StoreCard = () => {
    return (
    <div className='store-card'>
        <h1>Store details</h1>
        <div className='store-details-container'>
            <div className='store-card-details'>
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>Name</span>
                    <span style={{ float: 'right', textAlign: 'left' }}>My store name</span>
                </p><br />
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>Website</span>
                    <span style={{ float: 'right', textAlign: 'left' }}>www.mystore.com</span>
                </p><br />
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>House No</span>
                    <span style={{ float: 'right', textAlign: 'left'}}>0</span>
                </p><br />
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>Street</span>
                    <span style={{ float: 'right', textAlign: 'left'}}>My store street</span>
                </p><br />
            </div>
            <div className='store-card-details'>
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>Postalcode</span>
                    <span style={{ float: 'right', textAlign: 'left'}}>0</span>
                </p><br />
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>City</span>
                    <span style={{ float: 'right', textAlign: 'left'}}>My store city</span>
                </p><br />
                <p>
                    <span style={{ float: 'left', fontWeight: 'bold' }}>Country</span>
                    <span style={{ float: 'right', textAlign: 'left'}}>My store country</span>
                </p><br />
            </div>
        </div>
    </div>
    )
}

export default StoreCard;