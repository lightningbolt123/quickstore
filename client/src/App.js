import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './reducers/productSlice';
import Products from './screens/Products';
import Navigator from './components/Navigator';

function App() {
  return (
    <Router>
      <Navigator />
      <Routes>
        <Route path="/" element={<Products />} />
      </Routes>
    </Router>
  )
}

export default App;
