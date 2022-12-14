import React, { useState, useEffect, useRef } from 'react';
import { mySetInterval } from '../common/utils';
import './App.css';


const socket = window.io('http://localhost:3000');

/* eslint-disable */
function App() {
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const rangeRef = useRef(null);
  const [type, setType] = useState('case1');
  const [totalTime, setTotalTime] = useState(0);
  const [timerData, setTimerData] = useState({});
  const [hasTimer, setHasTimer] = useState(false);

  const [timeSpace, setTimeSpace] = useState(0);

  const [startPrice, setStartPrice] = useState(0);

  const [maxPriceInfo, setMaxPriceInfo] = useState(1);


  const [userHistoryList, setUserHistoryList] = useState([])

  const [historyList, setHistoryList] = useState([])


  useEffect(() => {
    socket.on('toubiao', (listData, userHistoryList, maxPriceInfo) => {
      // 处理数据
      setHistoryList(listData);
      setUserHistoryList(userHistoryList);
      setMaxPriceInfo(maxPriceInfo);
      console.log('msg', listData, userHistoryList, maxPriceInfo);

    });

    socket.on('start', (timerData) => {
      const { startTime, endTime } = timerData;
      // 计算误差，单位毫秒
      const wucha = Date.now() - startTime;
      console.log('wucha', wucha)
      setTimeSpace(wucha);
      setType('case2');
      setHasTimer(true);
      setTimerData(timerData);
    });

  }, []);
  const [leftTime, setLeftTime] = useState(0);

  useEffect(() => {

    if (!timerData.startTime || timerData.startTime <= 0) {
      return;
    }

    const { endTime } = timerData;
    const nowTime = Date.now();
    const leftTime = endTime - nowTime + timeSpace;
    setLeftTime(Math.floor(leftTime / 1000));

    let timer = mySetInterval(() => {
      const nowTime = Date.now();
      const { endTime } = timerData;
      const leftTime = endTime - nowTime + timeSpace;
      setLeftTime(Math.floor(leftTime / 1000));
      if (leftTime <= 0) {
        timer.flag = false;
        socket.emit('end');
        setHasTimer(false);
        setUserHistoryList([]);
        setHistoryList([]);
      }
    }, 1000)
  }, [timerData.startTime]);
  const handlePaimai = () => {
    const name = nameRef?.current?.value;
    if (!name) {
      alert('Please enter item name');
      return;
    }
    const price = priceRef?.current?.value;
    if (price <= 0) {
      alert('Price must be greater than zero');
      return;
    }
    const range = rangeRef?.current?.value;
    setStartPrice(price);
    const data = {
      name,
      startPrice: price,
      countTime: range,
      startTime: Date.now()
    }
    setMaxPriceInfo({});
    socket.emit('start', JSON.stringify(data));
  }

  const handleNewPaimai = () => {
    if (leftTime > 0) {
      alert('Auction in progress');
      return;
    }
    setType('case1');
  }

  return (
    <div className="App">
      {
        type === 'case1' && (
          <div className='paipai-form'>
            <div className='name'>
              <label className='label-text'>Item name:</label>
              <input className='name-input fm-text' type="text" ref={nameRef} />
            </div>
            <div className='price'>
              <label className='label-text'>Reserve price:</label>
              <input className='price-input fm-text' type="number" min={1} ref={priceRef} />
            </div>
            <div className='range'>
              <label className='label-text'>Auction duration:</label>
              <input className='price-input fm-text' type="range" min="10" max="80" ref={rangeRef} step={10} />
            </div>
            <div className='submit-btn' onClick={() => {
              handlePaimai();
            }}>Start Auction</div>
          </div>
        )
      }
      {
        type === 'case2' && (
          <div className='paimai-countdown'>
            {
              leftTime > 0 && (
                <div className='countdown-time'>
                  {leftTime}
                </div>
              )
            }
            <div className='price-info'>
              <div className='sub-title'>拍卖实时信息</div>
              <div className='max-price-name'>Highest bidder：{maxPriceInfo.username || 'Autioneer'}</div>
              <div className='max-price'>Highest bid price：{maxPriceInfo.maxPrice || startPrice}</div>
              <div className='total-count'>Number of bids：{maxPriceInfo.totalCount || 0}</div>
            </div>
            <div className='price-info'>
              <div className='sub-title'>投标者信息</div>
              {
                userHistoryList.map((item, index) => {
                  return (
                    <div key={index} className="bidder-info">
                      <div className='item'>Bidder name：{item.username}</div>
                      <div className='item'>Highest bid：{item.maxPrice}</div>
                      <div className='item'>Time：{item.count}</div>
                    </div>
                  )
                })
              }
            </div>
            <div className='price-info'>
              <div className='sub-title'>投标历史记录</div>
              {
                historyList.map((item, index) => {
                  return (
                    <div key={index} className="history-item">
                      <div className='item'>Name：{item.username}</div>
                      <div className='item'>Price：{item.price}</div>
                    </div>
                  )
                })
              }
            </div>
            <div className={`new-btn ${hasTimer ? 'disabled' : 'normal'}`} onClick={() => {
              handleNewPaimai();
            }}>Start new auction</div>
          </div>
        )
      }
    </div>
  );
}

export default App;
