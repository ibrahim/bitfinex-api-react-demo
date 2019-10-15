import * as constants from './constants'

const initial_state = null

function TradeReducer(state, action) {
  if (typeof state === 'undefined') {
    state = initial_state 
  }

  if (action.type === constants.SAVE_TRADES) {
    if(action.payload && !Array.isArray(action.payload[1])){
      const prev_trades = Array.isArray(state) ? state : []
      const trades = [action.payload[2], ...prev_trades].slice(0,21)
      return trades
    }else{
      return action.payload[1].slice(0,21)
    }
  } else {
    return state
  }
}

export default TradeReducer
