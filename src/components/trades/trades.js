import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components"
import {connect} from 'react-redux'
import {throttle} from 'lodash'
import {IoLogoBitcoin} from 'react-icons/io'
import {FaCaretDown,FaCaretUp} from 'react-icons/fa'
import numberWithCommas from '../../helpers/format-number'
import moment from 'moment'


const WS_URL = 'wss://api-pub.bitfinex.com/ws/2'

const Trades = connect(s => ({ trades: s.trades }))((props) => {
  const { trades } = props
  // const empty_trades = [0,[0,0,0,0]]
  // const [trades, setTrades] = useState(empty_trades)
  // useEffect(() => {
  //   socket.current.onmessage = (msg) => { 
  //     const data = JSON.parse(msg.data)
  //     console.log(msg)
  //     console.log("----------------------------------")
  //     console.log(data)
  //     Array.isArray(data) && throttle(() => setTrades(data),1000)
  //   }
  //   socket.current.onopen = () => socket.current.send(msg)
  // },[])

  // console.log({trades})
  // const [ CHANNEL_ID,[ID,MTS,AMOUNT,PRICE]] = Array.isArray(trades) ? trades : empty_trades
  const _trades = trades && Array.isArray(trades) && trades.reduce((acc,item) => {
    const day = item[1]
    const day_key = moment(day).format("YYYYMMDD")
    if(!Array.isArray(acc[day_key])) acc[day_key] = []
    acc[day_key] = [...acc[day_key], item]
    return acc;
  },{})
  return(
      <Panel>
        <Bar>
          <h3>Trades <span>BTC/USD</span></h3>
        </Bar>
        <Side>
          <thead>
            <Row>
                <Col>Time</Col>
                <Col>Price</Col>
                <Col>Amount</Col>
              </Row>
          </thead>
          <tbody>  
              {_trades && Object.keys(_trades).map((k, kx)=> {
                const formatted_date = moment(k).format('MMMM Do YYYY')
                return(
                  <React.Fragment key={`trade-${formatted_date}`}>
                    <RowHeader>
                      <td colspan="3">
                      {formatted_date}
                      </td>
                    </RowHeader>
                    <React.Fragment>
                      { Array.isArray(_trades[k]) && _trades[k].map((i, ix) => {
                      const time = i[1] && moment(i[1]).format("hh:mm:ss")
                      const price = i[2] && numberWithCommas(i[3].toFixed(1))
                      const amount = i[3] && Math.abs(i[2]).toFixed(4)
                      const [amount1, zeros] = String(amount).split(/(0+)$/)
                      const status = amount > 0 ? "green" : "red" 
                      const grade = Math.abs(amount) > 0.5 ? "high" : "low"
                      return(
                        <Row className={`${status} ${grade}`} key={`trade-${ix}${time}-${price}-${amount}`}>
                          <Col><span/ >{ time}</Col>
                          <Col>{ price } </Col>
                          <Col>{ amount1 }{typeof zeros === 'string' && <em>{ zeros }</em> }</Col>
                        </Row>
                      )
                      })}
                    </React.Fragment>
                </React.Fragment>
                )
              })}
          </tbody>  
        </Side>
      </Panel>
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
export const Panel = styled.div`
  background-color: #1b262d;
  flex-grow:0;
  display: flex;
  flex-flow: column;
  margin:5px;
  width:400px;
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
flex-basis:400px;
margin:0px 1px;
thead {
  td {
    text-transform:uppercase;
    font-size:12px;
    color:#aaa!important;
  }
}
tbody {
  tr {
    td {
      position:relative;
    }
  }
  tr.red.low { 
    td { 
      background-color: #2c2931; 
    } 
  }
  tr.red.high { 
    td { 
      background-color: #462e35; 
    } 
  }
  tr.green.low { 
    td { 
      background-color: #242f2f; 
    } 
  }
  tr.green.high { 
    td { 
      background-color: #303d32; 
    } 
  }
  tr {
    span {
      position:absolute;
      top:5px;
      left:10px;
      content: ' ';
      display:block;
      height:10px;
      width: 10px;
      border-radius:5px;
    }
  }
  tr.green {
    span {
      background-color:#77903f;
    }
  }
  tr.red {
    span {
      background-color:#82332f;
    }
  }
}
`;

export const Row = styled.tr`
`;
export const RowHeader = styled.tr`
    text-align:center;
    font:bold 15px Arial;
    padding:3px 0px;
`;
export const Col = styled.td`
  color:#F0F0f0;
  padding:1px 10px;
  flex:1;
  font:normal 14px Arial;
  text-align:center;
  em {
    color: #666;
    font-weight:normal;
    font-style:normal;
  }
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
    font:normal 18px Arial!important;
    font-weight:normal;
    justify-self:flex-start;
    span {
      color:#888;
      font-size:15px;
    }
  }
`;
export default Trades
