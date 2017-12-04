# complex-state
> Making multiple state compose a complex state by friendly

> 友好的使多个状态组成复合状态

### 需求
日常开发中，会有多个状态组成一个复合状态的场景。
比如：
  1. 后端没有条件给前端提供一个状态，需要前端自己通过多个状态来判断一个元素的显示或隐藏。
  2. 后端没有条件给前端提供一个状态，需要前端自己通过多个状态来判断应该展示哪个文案。

于是。。。拿到了需要判断的状态，以及通过接口文档知道了各个字段的可能取值，如下：
```javascript
  const stateObj = {
    state1: true, // 类型{Boolean} 取值[true|false]
    state2: 0, // 类型{Number} 取值[0|1|2]
    state3: 'STATE_1' // 类型{String} 取值['STATE_1'|'STATE_2']
  }
```
### 案例
接下来准备写函数判断各种状态
```javascript
  const methods = {
    showLogoA (stateObj) {
      // 当state1为true，state2为0，state3为'STATE_1'时展示logoA
      return stateObj.state1 && stateObj.state2 === 0 && stateObj.state3 === 'STATE_1'
    },
    getlogoInfo (stateObj) {
      const infoMap = {
        STATE_1: 'this is infoA',
        STATE_2: 'this is infoB'
      }
      if (stateObj.state1) {
        // stateObj.state1 为 true时，stateObj.state2 为0时， 返回stateObj.state3在infoMap中对应的状态信息
        if (stateObj.state2 === 0) {
          return infoMap[stateObj.state3] || ''
        }
        // 如果stateObj.state2为1或2，stateObj.state3 为STATE_1时，
        // 返回信息：“this is infoC”
        if ((stateObj.state2 === 1 || stateObj.state2 === 2) && stateObj.state3 === 'STATE_1') {
          return 'this is infoC'
        }
      }
      // 否则返回空字符串
      return ''
    }
  }

  // 调用
  methods.showLogoA(stateObj) // true
  methods.getlogoInfo(stateObj) // this is infoA
```
新的解法
```javascript
  import ComplexState from 'complexState'

  // 定义source, 二维数组，可视作是排列了所用情况的一张表格，具体解释看下文
  const stateSource = [
    ['state1', 'state2', 'state3'],
    [  true  ,    0    , 'STATE_1', 'showLogoA', 'this is infoA'],
    [  true  ,    0    , 'STATE_2', 'showLogoB', 'this is infoB'],
    [  true  ,  [1,2]  , 'STATE_1', 'showLogoC', 'this is infoC']
  ]

  const logoState = new ComplexState(stateSource)

  const methods = {
    showLogoA: logoState.isStateResource('showLogoA'),
    getlogoInfo: logoState.getStateResource()
  }

  // 调用
  methods.showLogoA(stateObj) // true
  methods.getlogoInfo(stateObj) // this is infoA
```


