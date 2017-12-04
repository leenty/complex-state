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
    state2: 2, // 类型{Number} 取值[0|1|2|3|4|5]
    state3: 'STATE_1' // 类型{String} 取值['STATE_1'|'STATE_2'|'STATE_3']
  }
```
接下来准备写函数判断各种状态
```javascript
  const methods = {
    elementAShow (stateObj) {
      // 当state1为true，state2为2，state3为'STATE_1'时展示元素A
      return stateObj.state1 && stateObj.state2 === 2 && stateObj.state3 === 'STATE_1'
    },
    getStateInfo (stateObj) {
      return 
    }
  }
```