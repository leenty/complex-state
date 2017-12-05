const ComplexState = require('../lib')

// 定义source, 二维数组，可视作是排列了所用情况的一张表格，具体解释看下面
const stateSource = [
  ['state1', 'state2', 'state3'],
  [  true  ,    0    , 'STATE_1', 'showLogoA', 'this is infoA'],
  [  true  ,    0    , 'STATE_2', 'showLogoB', 'this is infoB'],
  [  true  ,  [1,2]  , 'STATE_1', 'showLogoC', 'this is infoC']
]

const logoState = new ComplexState(stateSource)

const stateObj = {
  state1: true, // @type{Boolean} 取值[true|false]
  state2: 0, // @type{Number} 取值[0|1|2|3]
  state3: 'STATE_1' // @type{String} 取值['STATE_1'|'STATE_2']
}

const methods = {
  showLogoA: logoState.isStateResource('showLogoA'),
  getlogoInfo: logoState.getStateResource()
}

// 调用
console.log(methods.showLogoA(stateObj)) // true
console.log(methods.getlogoInfo(stateObj)) // this is infoA