
import React, {useEffect, useState, useCallback} from 'react'
import { wsconnect, connected } from './ws-connect'
import useInterval from '../../helpers/use-interval'
import {connect} from 'react-redux'
import styled from "styled-components"
import * as Actions from './actions'
import {throttle} from 'lodash'

const PRECESION = ["P0","P1","P3","P4"]

const OrderBook = connect(s => (
  { book: s.orderbook,
}))((props) => {
  const { book } = props
  const { bids, asks, mcnt } = book
  // const [connected, setConnected] = useState(false)
  const saveBook = useCallback(throttle((b) => props.dispatch(Actions.saveBook(b)), 500))
  const [precesion, setPrecision] = useState(0)
  const decPrecision = () => precesion > 0 && setPrecision((precesion + PRECESION.length - 1) % PRECESION.length)
  const incPrecision = () => precesion < 4 && setPrecision((precesion + 1) % PRECESION.length)

  const [connectionStatus, setConnectionStatus] = useState(true)

  const startConnection = () => !connectionStatus && setConnectionStatus(true)
  const stopConnection = () => connectionStatus && setConnectionStatus(false)

  useEffect(() => {
    wsconnect({book, saveBook, precesion: PRECESION[precesion], setConnectionStatus, connectionStatus})
  }, [connectionStatus])

  return(
    <div>
      <Tools>
      { !connectionStatus && <Icon onClick={ startConnection }> start </Icon> }
      { connectionStatus && <Icon onClick={ stopConnection }> stop </Icon> }
        <Icon onClick={ incPrecision }>+</Icon>
        <Icon>{ PRECESION[precesion]} </Icon>
        <Icon onClick={ decPrecision }>-</Icon>
      </Tools>
    <Panel>
      <Side>
        <thead>
        <Row>
          <Col>Count</Col>
          <Col>Amount</Col>
          <Col className="total">Total</Col>
          <Col>Price</Col>
        </Row>
      </thead>
      <tbody>
      {bids && Object.keys(bids).map((k,i) => {
        const item = bids[k]
        const {cnt, amount, price} = item
        const total = Object.keys(bids).slice(0,i+1).reduce((t,i) => {
          t = t + bids[i].amount
          return t
        },0)
        return(
          <Row>
            <Col>{ cnt }</Col>
            <Col>{ amount.toFixed(2) }</Col>
            <Col className="total">{ total.toFixed(2) }</Col>
            <Col>{ price }</Col>
          </Row>
        )
      })}
    </tbody>
      </Side>
      <Side>
        <thead>
        <Row>
          <Col>Count</Col>
          <Col>Amount</Col>
          <Col className="total">Total</Col>
          <Col>Price</Col>
        </Row>
      </thead>
      <tbody>
      {asks && Object.keys(asks).map((k,i) => {
        const item = asks[k]
        const {cnt, amount, price} = item
        const total = Object.keys(asks).slice(0,i+1).reduce((t,i) => {
          t = t + asks[i].amount
          return t
        },0)
        return(
          <Row>
            <Col>{ cnt }</Col>
            <Col>{ amount.toFixed(2) }</Col>
            <Col className="total">{ total.toFixed(2) }</Col>
            <Col>{ price }</Col>
          </Row>
        )
      })}
    </tbody>
      </Side>
    </Panel>
  </div>
  )
})

export const Panel = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

export const Side = styled.table`
flex-basis:300px;
margin:0px 20px;
`;

export const Row = styled.tr`
`;
export const Col = styled.td`
  padding:1px 10px;
  flex:1;
  font:normal 14px Arial;
  &.total {
    text-align:right;
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
`;
export default OrderBook
