import './App.css';
import 'react-phone-number-input/style.css'
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './reducers/productSlice';
import Products from './screens/Products';
import Product from './screens/Product';
import Navigator from './components/layout/Navigator';
import Footer from './components/layout/Footer';
import Signup from './screens/Signup';

function App() {
  return (
    <Router>
      <Navigator />
      <div className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/:id" element={<Product />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App;
