import { Link } from 'react-router-dom';

const Navigator = () => {
    return (
    <div className='menu'>
        <h2 style={{ float: 'left', color: '#ffffff', margin: '5px' }}>QuickStore</h2>
        <ul>
            <li>home</li>
            <li>categories</li>
            <li>cart</li>
            <li>wishlist</li>
        </ul>
    </div>)
}

export default Navigator;