import React from 'react';
import { Provider } from 'react-redux'
import configureStore from './store'
//import Dashboard from './components/dashboard'
import OrderBook from './components/order-book'
import Ticker from './components/ticker'
import styled from "styled-components"
import './App.css';

const store = configureStore()

function App() {
  return (
     <Provider store={store}>
       <Container>
        <OrderBook />     
        <Side>
          <Ticker />
        </Side>
      </Container>
    </Provider>
  )
}

export const Side = styled.div`
  display: flex;
  flex-flow: column;
`;
export const Container = styled.div`
  display: flex;
  flex-flow: row;
`;
export default App;
