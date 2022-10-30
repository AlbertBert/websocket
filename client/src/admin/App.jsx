import React, { useState, useEffect, useRef } from 'react';
import { mySetInterval } from '../common/utils';
import './App.css';

const socket = window.io('http://localhost:3000');

/* eslint-disable */
function App() {
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const [username, setUsername] = useState('');
  const [type, setType] = useState('case1');
  const [totalTime, setTotalTime] = useState(0);
  const [timerData, setTimerData] = useState({});

  const [timeSpace, setTimeSpace] = useState(0);

  const [projectName, setProjectName] = useState('');
  const [startPrice, setStartPrice] = useState(0);

  const [maxPriceInfo, setMaxPriceInfo] = useState({});
  const [maxPrice, setMaxPrice] = useState(10);
  const [price, setPrice] = useState(0);
  const [errorTip, setErrorTip] = useState('');


  useEffect(() => {
    if (!username) {
      return;
    }
    socket.on('start', (data) => {
      console.log('username', username);
      if (!username) {
        return;
      }
      setMaxPriceInfo({});
      console.log('msg', data);
      setProjectName(data.name);
      const { startTime, endTime } = data;
      const wucha = Date.now() - startTime;
      console.log('wucha', wucha)
      setTimeSpace(wucha);
      setStartPrice(data.startPrice);
      setType('case3');
      setTimerData(data);
    });

    socket.on('maxPriceInfo', (maxPriceInfo) => {
      if (!username) {
        return;
      }
      console.log('msg', maxPriceInfo);
      setMaxPriceInfo(maxPriceInfo);
    });

  }, [username]);
  const [leftTime, setLeftTime] = useState(0);

  useEffect(() => {

    if (!timerData.startTime || timerData.startTime <= 0) {
      return;
    }

    const { endTime } = timerData;
    const nowTime = Date.now();
    const leftTime = endTime - nowTime + timeSpace;
    console.log('leftTime', leftTime, endTime, nowTime, timeSpace)
    setLeftTime(Math.floor(leftTime / 1000));

    let timer = mySetInterval(() => {
      const nowTime = Date.now();
      const { endTime } = timerData;
      const leftTime = endTime - nowTime + timeSpace;
      console.log('leftTime', leftTime, endTime, nowTime, timeSpace)
      setLeftTime(Math.floor(leftTime / 1000));
      if (leftTime <= 0) {
        timer.flag = false
        setType('case2');
      }
    }, 1000)
  }, [timerData.startTime]);
  const handleSubmit = () => {
    const name = nameRef?.current?.value;
    if (!name) {
      alert('Please enter your name');
      return;
    }
    setUsername(name);
    setType('case2');
  }
  const handleToubiaoSubmit = () => {

    if (price > 0 && maxPriceInfo.maxPrice > 0 && price < maxPriceInfo.maxPrice) {
      alert('Bid too low!');
      return;
    }
    const data = {
      username,
      price: Number(price)
    }
    console.log('data', data);
    socket.emit('toubiao', JSON.stringify(data));
  }
  return (
    <div className="App">
      {
        type === 'case1' && (
          <div className='paipai-form'>
            <div className='name'>
              <label className='label-text'>Name:</label>
              <input className='name-input fm-text' type="text" ref={nameRef} />
            </div>
            <div className='submit-btn' onClick={() => {
              handleSubmit();
            }}>Submit</div>
          </div>
        )
      }
      {
        type === 'case2' && (
          <>
            {
              maxPriceInfo.username && (
              <div className='last-paimai'>
                <div className='last-winner-name'>Bidders from previous round：{maxPriceInfo.username}</div>
                <div className='last-winner-price'>Bids from previous round：{maxPriceInfo.maxPrice}</div>
              </div>
              )
            }
            <div className='wait-paimai'>
              Waiting for auction start 
            </div>
          </>
        )
      }
      {
        type === 'case3' && (
          <div className='toubiao'>
            {
              leftTime > 0 && (
                <div className='countdown-time'>
                  {leftTime}
                </div>
              )
            }
            <div className='paimai-info'>
              <div className='name'>Item name：{projectName}</div>
              <div className='max-price-name'>Current highest bidder：{maxPriceInfo.username || 'Autioneer'}</div>
              <div className='maxprice'>Current highest bid：{maxPriceInfo.maxPrice || startPrice}</div>
            </div>
            <div className='price'>
              <label className='label-text'>Price:</label>
              <input className='price-input fm-text' type="number" min={1} ref={priceRef} onChange={() => {
                const price = priceRef?.current?.value;
                console.log('price', price)
                setPrice(Number(price));
                const tempMaxPrice = maxPriceInfo.maxPrice || startPrice
                if (price > 0 && tempMaxPrice > 0 && price <= tempMaxPrice) {
                  setErrorTip('投标过低');
                } else {
                  setErrorTip('');
                }
              }} />
            </div>
            {
              errorTip && (
                <div className='error-tip'>Bid too low!</div>
              )
            }
            {
              maxPriceInfo.username === username && (
                <div className='success-tip'>You are currently the highest bidder!</div>
              )
            }
            <div className={`new-btn ${leftTime > 0 ? 'normal' : 'disabled'}`} onClick={() => {
              handleToubiaoSubmit();
            }}>Submit</div>
          </div>
        )
      }

    </div>
  );
}

export default App;
