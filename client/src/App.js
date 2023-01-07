import './App.css';
import 'react-phone-number-input/style.css'
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './reducers/productSlice';
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

const token =localStorage.getItem("token");
if (token) {
  setAuthToken(token); 
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <Router>
      <Navigator />
      <div className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="products/:id" element={<Product />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/settings" element={<PrivateRoute component={Settings} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App;
