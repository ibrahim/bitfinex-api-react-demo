import React from 'react';
import { Provider } from 'react-redux'
import configureStore from './store'
//import Dashboard from './components/dashboard'
import OrderBook from './components/order-book'

import './App.css';

const store = configureStore()

function App() {
  return (
     <Provider store={store}>
      <OrderBook />     
    </Provider>
  )
}

export default App;
