import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './reducers/productSlice';

function App() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getProducts())
  },[]);
  if (loading) return <p>...loading</p>
  return (
    <div className="App">
      <h1>Hello</h1>
      {products.map(product => (
        <p key={product.id}>{product.product_name}</p>
      ))}
    </div>
  );
}

export default App;
