import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import reduxThunk from 'redux-thunk'
import OrderBookReducer from '../components/order-book/reducer'

const middleware = [ reduxThunk ];
if (process.env.NODE_ENV !== 'production') {
    let redux_logger = require('redux-logger').createLogger
    middleware.push(redux_logger());
}

const configureStore = () => {

  const reducers = combineReducers({
    orderbook: OrderBookReducer
  })
  
  const store = createStore(
      reducers,
      {},
      compose(
        applyMiddleware(...middleware)
      )
  )

  return store
}

export default configureStore

