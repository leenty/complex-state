const ComplexState = require('../lib')

// 预定义复合状态
// 复合状态其实可以看做是一张表
// 由表头(map)和条目组成
// 每个条目声明了由多个状态组成一个复合状态的关系
// 
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

const stateMap = new ComplexState(stateSource)

// 基础用法：获取预定义的复合状态
;(() => {
  const dataObj = {
    state1: 2,
    state2: 6
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
    state1: 2,
    state2: 6
  }
  // 对象查询形式
  const objResult = stateMap.isState('cancelRefunds', dataObj)
  console.log('查询(state1 === 2 && state2 === 6)的时候复合状态标识是否为(cancelRefunds)：', objResult)

  // 多参数查询形式
  // 多参数查询情况下，要遵守预先定义的顺序
  const argsResult = stateMap.isState('cancelRefunds', dataObj.state1, dataObj.state2) // 取消了本次退款申请
  console.log('查询(state1 === 2 && state2 === 6)的时候复合状态标识是否为(cancelRefunds)：', argsResult)
})()

// 特殊用法：自定义多参数输入顺序
// 使用场景：想指定多参查询时的参数顺序的时候
;(() => {
  const dataObj = {
    state1: 2,
    state2: 6
  }
  // 原来多参数的顺序为['state1', 'state2']，现在被改成了['state2', 'state1']
  const getStateByMap_Result1 = stateMap.getStateByMap(['state2', 'state1'], dataObj.state2, dataObj.state1)
  // 同样的，isState也有map方法，isStateByMap。除了在开头多了个map参数，其他保持一致
  const isStateByMap_Result1 = stateMap.isStateByMap(['state2', 'state1'], 'cancelRefunds', dataObj.state2, dataObj.state1)
  console.log(`改变参数的传入顺序。原来['state1', 'state2']被改成了['state2', 'state1']：`, getStateByMap_Result1, isStateByMap_Result1)

  // 改变了多参数查询时参数的输入顺序， 这在解构一个数组为参数的时候非常有用
  const dataArr = [6, 2] // state2 = 6, state1 = 2
  const getStateByMap_Result2 = stateMap.getStateByMap(['state2', 'state1'], ...dataArr)
  const isStateByMap_Result2 = stateMap.isStateByMap(['state2', 'state1'], 'cancelRefunds', ...dataArr)
  console.log(`这在对数组解构后当作参数传递十分便捷：`, getStateByMap_Result2, isStateByMap_Result2)

  // 其实还可以更加便捷
  // 使用Resource函数可以便捷的生成，拥有特定map的函数
  const getState1 = stateMap.getStateResource(['state2', 'state1']) // 返回绑定了map的函数getState1，可以直接调用
  // 可以像使用getState一样
  const getState_Result1 = getState1(dataObj.state2, dataObj.state1)
  // 一样可以传入解构数组参数
  const getState_Result2 = getState1(...dataArr)
  // 对于isState也是一样的
  // 但是这里的命名可以更加清晰
  const isCancelRefunds1 = stateMap.isStateResource('cancelRefunds', ['state2', 'state1'])
  // 然后调用可得判断状态
  const result1 = isCancelRefunds1(...dataArr)
  // 对于Resource方法，map默认是原先预定义的stateSource表头，所以没有特殊需要是可以不传的
  const isCancelRefunds2 = stateMap.isStateResource('cancelRefunds')
  const result2 = isCancelRefunds2(...dataArr)
})()




