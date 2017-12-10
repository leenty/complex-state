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
    state2: 0, // 类型{Number} 取值[0|1|2|3]
    state3: 'STATE_1' // 类型{String} 取值['STATE_1'|'STATE_2']
  }
```
### 案例
接下来准备写函数判断各种状态
```javascript
  const methods = {
    // 判断logoA显示
    showLogoA ({state1, state2, state3}) {
      // 当state1为true，state2为0，state3为'STATE_1'时展示logoA
      return state1 && state2 === 0 && state3 === 'STATE_1'
    },
    // 获取要展示的相应文案
    getlogoInfo ({state1, state2, state3}) {
      const infoMap = {
        STATE_1: 'this is infoA',
        STATE_2: 'this is infoB'
      }
      if (state1) {
        // state1 为 true时，state2 为0时， 返回state3在infoMap中对应的状态信息
        if (state2 === 0) {
          return infoMap[state3] || ''
        }
        // 如果state2为1或2，state3 为STATE_1时，
        // 返回信息：“this is infoC”
        if ((state2 === 1 || state2 === 2) && state3 === 'STATE_1') {
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

  // 定义source, 二维数组，可视作是排列了所用情况的一张表格，具体解释看下文: 详解-source
  const source = [
    ['state1', 'state2', 'state3'],
    [  true  ,    0    , 'STATE_1', 'showLogoA', 'this is infoA'],
    [  true  ,    0    , 'STATE_2', 'showLogoB', 'this is infoB'],
    [  true  ,  [1,2]  , 'STATE_1', 'showLogoC', 'this is infoC']
  ]

  // 实例化ComplexState对象
  const demoResource = new ComplexState(source)

  const methods = {
    // 通过isStateResource方法获取showLogoA的判断函数
    showLogoA: demoResource.isStateResource('showLogoA'),
    // 通过getStateResource方法获取文案函数
    getlogoInfo: demoResource.getStateResource()
  }

  // 调用
  methods.showLogoA(stateObj) // true
  methods.getlogoInfo(stateObj) // this is infoA
```

### 安装
```
npm i -S complex-state
```
### 使用
```javascript
  // 导入
  import ComplexState from 'complexState'

  // 定义复合状态关系表
  const source = [
    ['state1', 'state2', 'state3'],
    [  true  ,    0    , 'STATE_1', 'showLogoA', 'this is infoA'],
    [  true  ,    0    , 'STATE_2', 'showLogoB', 'this is infoB'],
    [  true  ,  [1,2]  , 'STATE_1', 'showLogoC', 'this is infoC']
  ]

  // 传入source实例化对象
  const demoResource = new ComplexState(source)
```

### 详解复合状态关系表-`source`
`ComplexState`需要开发者提供一个`source`才能开始工作。

`source`实质上可以说是一张列举了所有`complexState(复合状态)`与子状态关系的一张表格。

这张表格是一段二维数组，数组的第一行为表头，记录着这张表格里参与判断复合状态的所有子状态名称。

之后的每一行都是记录着一段子状态与其复合状态的关系。

在每段关系的最后两个字段，存储着这段复合状态关系的`token(令牌)`和`value(值)`。

看下面表格

 \      | ...子状态 | `token(复合状态的令牌)` | `value(复合状态的值)`
-----:  | -------- | :-----------: | :--------:
   表头 | `'state1', 'state2', 'state3'` | --- | ---
复合关系 | `true, 0, 'STATE_1'`     | `'showLogoA'` | `'this is infoA'`
复合关系 | `true, 0, 'STATE_2'`     | `'showLogoB'` | `'this is infoB'`
复合关系 | `true, [1,2], 'STATE_3'` | `'showLogoC'` | `'this is infoC'`

当所有满足`source`里的条件的时候，就可以取出`value(复合状态的值)`

### API
每个`ComplexState`的实例对象都含有两个类型三种方法，供六个方法

  \        | 基础api      | map api           | resource api
---------: | ------------ | ----------------- | ------------
`get(获取)` | `getState()` | `getStateByMap()` | `getStateResource()`
`is(检查)`  | `isState()`  | `isStateByMap()`  | `isStateResource()`


##### get类型
`getState()`，`getStateByMap()`，`getStateResource()`用于获取`value(复合状态的值)`

##### is类型
`isState()`，`isStateByMap()`，`isStateResource()`用于判断是不是`token(复合状态的令牌)`

##### 基础api
用于快捷判断或是获取
```javascript
  /**
   * [实例方法]获得预定义的状态
   * @param  {Array|String|Boolean|Number} ...states 查询状态的子参数
   * @return {result}                                返回预定义的状态
   */
  getState(...states) {...}

```
```javascript
对于参数states，提供参数式或是对象式入参
const demoResource = new ComplexState(source)
demoResource.getState()

```