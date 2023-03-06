import './App.css';
import 'react-phone-number-input/style.css'
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './reducers/authSlice';
import setAuthToken from './utils/setAuthToken';
import Products from './screens/Products';
import Product from './screens/Product';
import Navigator from './components/layout/Navigator';
import Footer from './components/layout/Footer';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import PrivateRoute from './components/routing/PrivateRoute';
import Store from './screens/Store';
import CreateOrUpdateStore from './screens/CreateOrUpdateStore';
import AddProduct from './screens/AddProduct';
import UpdateProduct from './screens/UpdateProduct';
import Cart from './screens/Cart';
import Invoice from './screens/Invoice';
import Orders from './screens/Orders';
import Order from './screens/Order';
import Wallet from './screens/Wallet';
import AddBankAccount from './screens/AddBankAccount';
import EditBankAccount from './screens/EditBankAccount';
import Withdraw from './screens/Withdraw';
import Wishlist from './screens/Wishlist';

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token); 
}

function App() {
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Navigator />
      <div className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/store" element={<PrivateRoute><Store /></PrivateRoute>} />
          <Route path="/invoice/:id" element={<PrivateRoute><Invoice /></PrivateRoute>} />
          <Route path="/create-store" element={<PrivateRoute><CreateOrUpdateStore /></PrivateRoute>} />
          <Route path="/update-store" element={<PrivateRoute><CreateOrUpdateStore /></PrivateRoute>} />
          <Route path="/add-product" element={<PrivateRoute ><AddProduct /></PrivateRoute>} />
          <Route path="/update-product/:id" element={<PrivateRoute><UpdateProduct /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><Order /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          <Route path="/add-bank" element={<PrivateRoute><AddBankAccount /></PrivateRoute>} />
          <Route path="/edit-bank/:id" element={<PrivateRoute><EditBankAccount /></PrivateRoute>} />
          <Route path="/withdraw-funds" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App;
