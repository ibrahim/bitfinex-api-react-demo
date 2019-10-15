
import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components"
import {IoLogoBitcoin} from 'react-icons/io'
import {FaCaretDown,FaCaretUp} from 'react-icons/fa'
import numberWithCommas from '../../helpers/format-number'


const WS_TICKER = 'wss://api-pub.bitfinex.com/ws/2'
const msg = JSON.stringify({ 
  event: 'subscribe', 
  channel: 'ticker', 
  symbol: 'tBTCUSD' 
})
// [
//   CHANNEL_ID,
//   [
//     BID,
//     BID_SIZE,
//     ASK,
//     ASK_SIZE,
//     DAILY_CHANGE,
//     DAILY_CHANGE_PERC,
//     LAST_PRICE,
//     VOLUME,
//     HIGH,
//     LOW
//   ]
// ]
// [ 237564, 
//   [
//     8363.5,
//     21.5480695,
//     8364.8,
//     17.223321080000005,
//     55,
//     0.0066,
//     8365,
//     3515.76437727,
//     8428.2,
//     8160.4
//   ]
// ]

const Ticker = () => {
  const socket = useRef(new WebSocket(WS_TICKER,"protocolOne"))
  const empty_ticker = [0,[0,0,0,0,0,0,0,0,0,0]]
  const [ticker, setTicker] = useState(empty_ticker)
  useEffect(() => {
    socket.current.onmessage = (msg) => { 
      const data = JSON.parse(msg.data)
      console.log("----------------------------------")
      console.log(data)
      Array.isArray(data) && setTicker(data)
    }
    socket.current.onopen = () => socket.current.send(msg)
  },[])

  console.log({ticker})
  const [ CHANNEL_ID,[BID,BID_SIZE,ASK,ASK_SIZE,DAILY_CHANGE,DAILY_CHANGE_PERC,LAST_PRICE,VOLUME,HIGH,LOW]] = Array.isArray(ticker) ? ticker : empty_ticker
  // const CHANNEL_ID = ticker[0]
  // const BID = ticker[1][0]
  // const BID_SIZE = ticker[1][1]
  // const ASK = ticker[1][2]
  // const ASK_SIZE = ticker[1][3]
  // const DAILY_CHANGE  = ticker[1][4]
  // const DAILY_CHANGE_PERC  = ticker[1][5]
  // const LAST_PRICE  = ticker[1][6]
  // const VOLUME  = ticker[1][7]
  // const HIGH  = ticker[1][8]
  // const LOW  = ticker[1][9]
  return(
    <Container>
      <BitCoinIcon><IoLogoBitcoin/></BitCoinIcon>
      <Side>
        <h4>BTC/USD</h4>
        <Line>VOL { VOLUME && numberWithCommas(VOLUME.toFixed(2)) } USD</Line>
        <Line>Low { LOW && numberWithCommas(LOW.toFixed(1)) }</Line>
      </Side>
      <Side>
        <h4>{ LAST_PRICE && numberWithCommas(LAST_PRICE.toFixed(1)) }</h4>
        <Line><span className={ DAILY_CHANGE_PERC < 0 ? `red` : 'green'}>
            { DAILY_CHANGE && numberWithCommas(DAILY_CHANGE.toFixed(2)) } 
            { DAILY_CHANGE_PERC < 0 ? <FaCaretDown /> : <FaCaretUp />} 
            ({DAILY_CHANGE_PERC}%)</span></Line>
        <Line>High { HIGH && numberWithCommas(HIGH.toFixed(1)) }</Line>
      </Side>
    </Container>
  )
}

export const Container = styled.div`
  display:flex;
  flex-flow:row nowrap;
  height:50px;
  padding: 10px;
  background-color:#1b262d;
  margin:5px;
`;
export const BitCoinIcon = styled.div`
  font-size:48px;
  width:60px;
  `;
export const Side = styled.div`
  display:flex;
  flex-flow:column;
  padding: 0px 20px;
  h4 {
    font:Bold 16px Arial;
    text-align:center;
    padding:0px;
    margin:0px;
  }
`;
export const Line = styled.div`
  color: #aaa;
  font:16px Arial;
  text-align:center;
  font:normal 14px Arial;
  span.red { color:red;}
  span.green { color:green;}
`;
export default Ticker
