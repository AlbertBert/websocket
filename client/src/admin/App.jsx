import React, { useState, useEffect, useRef } from 'react';
import { mySetInterval } from '../common/utils';
// import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
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
    socket.on('start', (data) => {
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
      console.log('msg', maxPriceInfo);
      setMaxPriceInfo(maxPriceInfo);
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
      alert('姓名不能为空');
      return;
    }
    setUsername(name);
    setType('case2');
    // setTimeout(() => {
    //   setTotalTime(10);
    //   setType('case3');
    // }, 5000);
  }
  const handleToubiaoSubmit = () => {

    if (price > 0 && maxPriceInfo.maxPrice > 0 && price < maxPriceInfo.maxPrice) {
      alert('投标过低');
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
              <label className='label-text'>姓名:</label>
              <input className='name-input fm-text' type="text" ref={nameRef} />
            </div>
            <div className='submit-btn' onClick={() => {
              handleSubmit();
            }}>提交</div>
          </div>
        )
      }
      {
        type === 'case2' && (
          <>
            {
              maxPriceInfo.username && (
              <div className='last-paimai'>
                <div className='last-winner-name'>上轮竞标者姓名：{maxPriceInfo.username}</div>
                <div className='last-winner-price'>上轮竞标者价格：{maxPriceInfo.maxPrice}</div>
              </div>
              )
            }
            <div className='wait-paimai'>
              等待下一次拍卖开始
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
              <div className='name'>项目名称：{projectName}</div>
              <div className='max-price-name'>当前最高出价者名称：{maxPriceInfo.username || '拍卖师'}</div>
              <div className='maxprice'>当前最高价格：{maxPriceInfo.maxPrice || startPrice}</div>
            </div>
            <div className='price'>
              <label className='label-text'>价格:</label>
              <input className='price-input fm-text' type="number" min={1} ref={priceRef} onChange={() => {
                const price = priceRef?.current?.value;
                console.log('price', price)
                setPrice(Number(price));
                if (price > 0 && maxPriceInfo.maxPrice > 0 && price <= maxPriceInfo.maxPrice) {
                  setErrorTip('投标过低');
                } else {
                  setErrorTip('');
                }
              }} />
            </div>
            {/* {
              price > 0 && maxPriceInfo.maxPrice > 0 && price < maxPriceInfo.maxPrice && (
                <div className='error-tip'>投标过低</div>
              )
            } */}
            {
              errorTip && (
                <div className='error-tip'>投标过低</div>
              )
            }
            {
              maxPriceInfo.username === username && (
                <div className='success-tip'>您是当前最高投标人！</div>
              )
            }
            <div className={`new-btn ${leftTime > 0 ? 'normal' : 'disabled'}`} onClick={() => {
              handleToubiaoSubmit();
            }}>提交</div>
          </div>
        )
      }

    </div>
  );
}

export default App;
