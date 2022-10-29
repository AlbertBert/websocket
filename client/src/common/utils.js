export function mySetInterval(fn, interval) {
  // 控制器，控制定时器是否继续执行
  var timer = {
    flag: true,
  };

  // 设置递归函数，模拟定时器执行。
  function callback() {
    if (timer.flag) { // 判断是否继续执行
      fn();
      setTimeout(callback, interval);
    }
  }
  // 启动定时器
  setTimeout(callback, interval);
  // 返回控制器
  return timer;
}