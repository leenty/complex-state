const complexState = require('../lib')

// 预定义复合状态
const stateSource = [
  [      'state1'       ,     'state2'    ,    'state3'   ] ,
  [         2           ,         6       ,               ,  'cancelRefunds'  , '取消了本次退款申请'],
  [    [1, 10, 11]      ,                 ,               ,     'refunds'     , '买家申请、修改、重新发起退款'],
  [        10           ,                 ,               ,   'modifyRefunds' , '修改了退款信息，等待商家处理'],
  [      [1, 11]        ,                 ,               ,   'waitRefunds'   , '发起了退款申请，等待商家处理'],
  [        4            ,                 ,               ,   'closeRefunds'  , '拒绝了本次退款申请，退款关闭'],
  [        12           ,                 ,               ,  'refuseRefunds'  , '未收到货或验货不通过，拒绝退款'],
  [        3            ,         2       ,  'stringFlag' , 'waitReturnGoods' , '已同意退款申请，等待买家退货'],
  [        6            ,                 , 'stringFlag1' , 'storeReturnGoods', '将前往门店退货']
]

const stateMap = new complexState(stateSource)

// 基础用法：获取预定义的复合状态
;(() => {
  const dataObj = {
    state2: 6,
    state1: 2
  }
  // 对象查询形式
  const objResult = stateMap.getState(dataObj) // 取消了本次退款申请
  console.log('查询(state1 === 2 && state2 === 6)时候的复合状态值：', objResult)
  // 多参数查询形式
  // 多参数查询情况下，要遵守预先定义的顺序
  const argsResult = stateMap.getState(dataObj.state1, dataObj.state2) // 取消了本次退款申请
  console.log('查询(state1 === 2 && state2 === 6)时候的复合状态值：', argsResult)
})()

// 基础用法：检查是否是某复合状态
;(() => {
  const dataObj = {
    state2: 6,
    state1: 2
  }
  // 对象查询形式
  const objResult = stateMap.isState('cancelRefunds', dataObj)
  console.log('查询(state1 === 2 && state2 === 6)的时候复合状态标识是否为(cancelRefunds)：', objResult)
  // 多参数查询形式
  // 多参数查询情况下，要遵守预先定义的顺序
  const argsResult = stateMap.getState('cancelRefunds', dataObj.state1, dataObj.state2) // 取消了本次退款申请
  console.log('查询(state1 === 2 && state2 === 6)的时候复合状态标识是否为(cancelRefunds)：', argsResult)
})()

// 特殊用法：自定义判断的
// 使用场景：想指定多参查询时的参数顺序的时候




