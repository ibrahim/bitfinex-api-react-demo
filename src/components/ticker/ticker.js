import React from 'react'
import styled from "styled-components"
import {connect} from 'react-redux'
import {IoLogoBitcoin} from 'react-icons/io'
import {FaCaretDown,FaCaretUp} from 'react-icons/fa'
import numberWithCommas from '../../helpers/format-number'

const Ticker = connect(s => ({ ticker: s.ticker }))((props) => {
  const { ticker } = props
  const empty_ticker = [0,[0,0,0,0,0,0,0,0,0,0]]

  const [ CHANNEL_ID,[BID,BID_SIZE,ASK,ASK_SIZE,DAILY_CHANGE,DAILY_CHANGE_PERC,LAST_PRICE,VOLUME,HIGH,LOW]] = Array.isArray(ticker) ? ticker : empty_ticker
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
})

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
