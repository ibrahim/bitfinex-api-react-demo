import React, {useEffect, useState, useCallback} from 'react'
import { wsconnect } from './ws-connect'
import useInterval from '../../helpers/use-interval'
import {connect} from 'react-redux'
import styled from "styled-components"
import * as Actions from './actions'
import * as TickerActions from '../ticker/actions'
import * as TradesActions from '../trades/actions'
import {throttle} from 'lodash'
import {MdZoomIn, MdZoomOut} from 'react-icons/md'
import {FaPlus, FaMinus} from 'react-icons/fa'
import numberWithCommas from '../../helpers/format-number'

const PRECESION = ["P0","P1"]
const OrderBook = connect(s => (
  { book: s.orderbook,
}))((props) => {
  const { book } = props
  const { bids, asks } = book

  const saveBook   = useCallback(throttle((b) => props.dispatch(Actions.saveBook(b)), 500))
  const saveTrades = useCallback(throttle((b) => props.dispatch(TradesActions.saveTrades(b)), 500))
  const saveTicker = useCallback(throttle((b) => props.dispatch(TickerActions.saveTicker(b)), 500))

  const [precesion, setPrecision] = useState(0)
  const [scale, setScale] = useState(1.0)

  const decPrecision = () => precesion > 0 && setPrecision((precesion + PRECESION.length - 1) % PRECESION.length)
  const incPrecision = () => precesion < 4 && setPrecision((precesion + 1) % PRECESION.length)
  const decScale = () => setScale(scale + 0.1)
  const incScale = () => setScale(scale - 0.1)

  const [connectionStatus, setConnectionStatus] = useState(true)

  const startConnection = () => !connectionStatus && setConnectionStatus(true)
  const stopConnection = () => connectionStatus && setConnectionStatus(false)

  const prec = precesion % PRECESION.length
  useEffect(() => {
    wsconnect({book, saveBook, saveTicker, saveTrades, setConnectionStatus, connectionStatus})
  }, [connectionStatus])

  const _asks = asks && Object.keys(asks).slice(0,21).reduce((acc,k,i) => { 
        const total = Object.keys(asks).slice(0,i+1).reduce((t,i) => {
          t = t + asks[i].amount
          return t
        },0)
        const item = asks[k]
        acc[k] = {...item, total}
        return acc
  },{})
  const maxAsksTotal = Object.keys(_asks).reduce((t,i) => {
    if(t < _asks[i].total) { 
      return _asks[i].total}
    else { 
      return t 
    }
  },0)
  const _bids = bids && Object.keys(bids).slice(0,21).reduce((acc,k,i) => { 
        const total = Object.keys(bids).slice(0,i+1).reduce((t,i) => {
          t = t + bids[i].amount
          return t
        },0)
        const item = bids[k]
        acc[k] = {...item, total}
        return acc
  },{})
  const maxBidsTotal = Object.keys(_bids).reduce((t,i) => {
    if(t < _bids[i].total) { 
      return _bids[i].total}
    else { 
      return t 
    }
  },0)

  return(
    <div>
      <Panel>

        <Bar>
      <h3>Order Book <span>BTC/USD</span></h3>
      <Tools>
      { !connectionStatus && <Icon onClick={ startConnection }> Connect </Icon> }
      { connectionStatus && <Icon onClick={ stopConnection }> Disconnect </Icon> }
      <Icon onClick={ incPrecision }> precesion </Icon>
      <Icon onClick={ decScale }><MdZoomOut/></Icon>
      <Icon onClick={ incScale }><MdZoomIn/></Icon>
      </Tools>
    </Bar>
      <Sides>
      <Side>
        <thead>
        <Row>
          <Col className="count">Count</Col>
          <Col>Amount</Col>
          <Col className="total">Total</Col>
          <Col>Price</Col>
        </Row>
      </thead>
      <tbody>
      {_bids && Object.keys(_bids).map((k,i) => {
        const item = _bids[k]
        const {cnt, amount, price, total} = item
        const percentage = ((total * 100) / (maxBidsTotal * scale))
        return(
          <Row 
            key={`book-${cnt}${amount}${price}${total}`}
            style={{
            backgroundImage: `linear-gradient(to left, #314432 ${ percentage }%, #1b262d 0%)`
          }}>
            <Col className="count">{ cnt }</Col>
            <Col>{ amount.toFixed(2) }</Col>
            <Col className="total">{ total.toFixed(2) }</Col>
            <Col>{ numberWithCommas(price.toFixed(prec)) }</Col>
          </Row>
        )
      })}
    </tbody>
      </Side>
      <Side>
        <thead>
        <Row>
          <Col>Price</Col>
          <Col className="total">Total</Col>
          <Col>Amount</Col>
          <Col className="count">Count</Col>
        </Row>
      </thead>
      <tbody>
      {_asks && Object.keys(_asks).map((k,i) => {
        const item = _asks[k]
        const {cnt, amount, price, total} = item
        const percentage = (total * 100) / (maxAsksTotal * scale)
        return(
          <Row style={{
            backgroundImage: `linear-gradient(to right, #402c33 ${ percentage }%, #1b262d 0%)`
          }}>
            <Col>{ numberWithCommas(price.toFixed(prec)) }</Col>
            <Col className="total">{ total.toFixed(2) }</Col>
            <Col>{ amount.toFixed(2) }</Col>
            <Col className="count">{ cnt }</Col>
          </Row>
        )
      })}
    </tbody>
      </Side>
    </Sides>
  </Panel>
  </div>
  )
})

// const Depth = () => {
//   return (
//   <svg width="300px" height="20" xmlns="http://www.w3.org/2000/svg"><linearGradient id="SVGID_124_" gradientUnits="userSpaceOnUse" x1="205.2935" y1="707.9475" x2="206.9863" y2="707.9475" ><stop  offset="0" style={{ stopColor: "#1b262d" }}/><stop  offset="0.78" style={{ stopColor: "red" }}/><stop  offset="1" style={{ stopColor: "red"}}/></linearGradient><g><rect fill="url(#SVGID_124_)" stroke-width="0" x="0" y="0" width="100%" height="100%" /></g></svg>
//   )
// }
//
// const depthbarSVG = (props) => {
//   return  "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(`<svg width="500px" height="100px" xmlns="http://www.w3.org/2000/svg"><linearGradient id="SVGID_124_" gradientUnits="userSpaceOnUse" x1="205.2935" y1="707.9475" x2="206.9863" y2="707.9475"><stop  offset="0" style="stop-color:#1b262d"/><stop  offset="${ props.percentage / 100}" style="stop-color:${ props.color }"/><stop  offset="1" style="stop-color:${ props.color }"/></linearGradient><g><rect fill="url(#SVGID_124_)" stroke-width="0" x="0" y="0" width="300px" height="100%" /></g></svg>`)))
// }

export const Panel = styled.div`
  background-color: #1b262d;
  flex-grow:0;
  display: flex;
  flex-flow: column;
  width:645px;
  margin:5px;
  padding:5px;
  box-sizing:border-box;
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
`;

export const Sides = styled.div`
  display:flex;
  flex-basis:100%;
  flex-flow:row nowrap;
`;
export const Side = styled.table`
border-spacing:0px;
flex-basis:50%;
width:calc(50% - 2px);
box-sizing:border-box;
margin:0px 1px;
thead {
  td {
    text-transform:uppercase;
    font-size:12px;
    color:#aaa!important;
  }
}
`;

export const Row = styled.tr`
  td.count{
    text-align:center;
  }
`;
export const Col = styled.td`
  color:#F0F0f0;
  padding:1px 10px;
  flex:1;
  font:normal 14px Arial;
  text-align:right;
            `;

export const Bar = styled.div`
  display:flex;
  flex-flow:row;
  justify-content:space-between;
  align-items:start;
  border-bottom:1px solid #555;
  height:30px;
  padding-bottom:5px;
  margin-bottom:10px;
  h3 {
    padding:10px 0px 0px 20px;
    margin:0px;
    font:normal 16px Arial!important;
    font-weight:normal;
    justify-self:flex-start;
    span {
      color:#888;
      font-size:16px;
    }
  }
`;
export const Tools = styled.div`
display:flex;
flex-flow:row;
justify-content: flex-end;
`;
export const Icon = styled.div`
  display:flex;
  flex-grow:0;
  padding:10px;
  font:normal 15px Arial; 
  svg {
    font-size:20px;
  }
`;
export default OrderBook
