class complexState {
  constructor(sources) {
    this.sources = sources
  }
  /**
   * [内部方法]错误处理
   * @param  {String} error 错误信息
   * @param  {Boolean} silent 是否屏蔽错误
   * @return {Error}        报错对象
   */
  static _stateMapError(errorMsg, silent) {
    const error = new Error(`[stateMap]: ${errorMsg}`)
    silent || console.error(error)
    return error
  }
  /**
   * [内部方法]解码参数方法，用于序列化不同方式的入参
   * @param  {Array} states   入参集合
   * @param  {Boolean} silent 是否屏蔽错误
   * @return {Object}         查询参数对象
   */
  static _decodeStates(states, sourceHead, silent) {
    const stateObj = {}
    // 如果参数只有一个且为一个对象
    if (states.length === 1 && states[0].constructor === Object) {
      sourceHead.forEach(map => {
        if (states[0].hasOwnProperty(map))
          stateObj[map] = states[0][map]
      })
    // 否则，视为多参数方式传入
    } else {
      sourceHead.forEach((map, index) => {
        if (index < states.length) {
          stateObj[map] = states[index]
        }
      })
    }
    // 如果解析结果为空
    if (JSON.stringify(stateObj) === '{}') {
      return this._stateMapError('无可用入参', silent)
    }
    return stateObj
  }
  /**
   * [内部方法]查询预定义状态
   * @param  {Object} stateObj 查询参数对象
   * @param  {Array} sources   预定义状态集合
   * @param  {Array} map       自定义查询顺序集合
   * @param  {Boolean} silent  是否在控制台抛出错误
   * @return {Array}           返回查询到的整条预定义的状态关系集合
   */
  static _findState(stateObj, sources, map, silent) {
    let resultSources = sources
    map.every(sourceName => {
      let state
      // 如果不查询这个字段，则直接跳过
      if (stateObj.hasOwnProperty(sourceName)) {
        state = stateObj[sourceName]
      } else {
        state = undefined
      }
      resultSources = this._filterSources(sourceName, state, resultSources, silent)
      // 因为数组第一项为source索引，也就是字段，所以，真正的值从第二项开始，故判断数据要大于1才会有有效匹配
      const hasSources = resultSources.length > 1
      // 如果返回false会退出循环，就不会在继续剩余的查询
      return hasSources
    })
    // 删除索引头（也就是数组第一段，代表表头的位置）
    resultSources.shift()
    // 如果结果长度为0，则代表查询不到结果
    if (!resultSources.length) {
      this._stateMapError(`查询不到结果${JSON.stringify(stateObj)}`, silent)
      return
    }
    if (resultSources.length > 1) {
      // 获得第一个复合状态的值
      const firstResult = resultSources[0].slice(-1)
      this._stateMapError(`查询到多个结果，返回第一个结果【${firstResult}】。请及时纠正重复内容。`, silent)
    }
    // 返回复合状态关系集合
    return resultSources[0]
  }
  /**
   * [内部方法]过滤出符合条件的项
   * @param  {String}                      sourceName 竖向查找的字段名
   * @param  {Array|String|Boolean|Number} states     竖向查询字段的匹配值
   * @param  {Array}                       sources    存放值分布的表
   * @param  {Boolean} silent 是否屏蔽错误
   * @return {Array}                                  返回是过滤出符合条件的项集合
   */
  static _filterSources(sourceName, states, sources, silent) {
    // 获取字段列的index
    const sourceIndex = sources[0].indexOf(sourceName)
    // 如果找不到匹配字段
    if (!~sourceIndex) {
      this._stateMapError(`找不到匹配的字段：${sourceName}`, silent)
      return false
    }
    // 过滤出符合条件的结果
    return sources.filter((source, index) => {
      // 跳过第一行，也就是表头部分
      if (index === 0){
        return true
      }
      // 如果不存在当前字段(源里面当前字段为空),则返回
      // if (!source[sourceIndex]) {
      //   return false
      // }
      // 检查当前单元格存在内容，并且为一个数组（这意味着这个字段可以等于取多个状态）
      if (source[sourceIndex] && source[sourceIndex].constructor === Array) {
        // 判断参数的值是否存在于预定义内容内
        return source[sourceIndex].includes(states)
      } else {
        // 否则直接判断是否对应
        return source[sourceIndex] === states
      }
    })
  }
   /**
    * [内部方法]查询主入口
    * @param  {Array}   states  参与查询的状态合集
    * @param  {Array}   sources 预定义的状态与复合状态关系表
    * @param  {Array}   map     自定义需要查询字段集合
    * @param  {String}  mode    查询模式：{getState|isState}
    * @param  {Boolean} silent  是否屏蔽错误
    * @return {result}          返回中文或英文查询结果
    */
  static _mapState(states, sources, map, mode = 'getState', silent) {
    // 解析传入参数，统一转为对象参数，如果实际解析时找不到可用参数，则会返回一个错误对象
    const newStates = this._decodeStates(states, map, silent)
    // 判断是否是对象，如果是Error对象，则说明没有有用参数，那么久没有继续的必要，直接返回
    if (newStates.constructor === Object) {
      // 获取真正表头
      const realMap = sources[0]
      // 查询匹配复合状态结果
      const resultState = this._findState(newStates, sources, realMap, silent)
      // 如果查询不到结果，直接返回
      if (!resultState) {
        return
      }
      // 如果查询到结果，并且是查询值的模式
      if (mode === 'getState') {
        // 则返回复合状态的值
        return resultState.slice(-1)[0]
      } else {
        // 否则返回状态标志
        return resultState.slice(-2, -1)[0]
      }
    }
    return
  }
  /**
   * [实例方法]获得预定义的状态
   * @param  {Array|String|Boolean|Number} states 查询状态的参数条件
   * @return {result}                             返回预定义的状态
   */
  getState(...states) {
    const map = this.sources[0]
    return this.constructor._mapState(states, this.sources, map, 'getState', false)
  }
  /**
   * [实例方法]通过自定义map,获得预定义的状态
   * @param  {Array}                       map    自定义判断流程
   * @param  {Array|String|Boolean|Number} states 参与判断的参数集合
   * @return {result}                             返回预定义的状态
   */
  getStateByMap(map, ...states) {
    return this.constructor._mapState(states, this.sources, map, 'getState', false)
  }
  /**
   * [实例方法]输入自定义map,获得一个已经预设自定义map的处理函数，直接调用即可
   * @param  {Array} map    用于覆盖预定义mao，这是一个可省参数，省略时默认为原来的map
   * @return {Function}     预设了map的状态获取函数，返回后的函数参数参考 getState
   */
  getStateResource(map = this.sources[0]) {
    return this.getStateByMap.bind(this, map)
  }
  /**
   * [实例方法]检查是否为指定状态
   * @param  {String}                      isState 要查询的状态
   * @param  {Array|String|Boolean|Number} states  查询状态的参数集合
   * @return {Boolean}                             返回是否为指定要查询的状态
   */
  isState(isState, ...states) {
    const map = this.sources[0]
    return isState === this.constructor._mapState(states, this.sources, map, 'isState', true)
  }
  /**
   * [实例方法]输入自定义map,检查是否为指定状态
   * @param  {String}                      isState 要查询的状态
   * @param  {Array}                       map     用于覆盖预定义mao，这是一个可省参数，省略时默认为原来的map
   * @param  {Array|String|Boolean|Number} states  查询状态的参数集合
   * @return {Boolean}                             返回是否为指定要查询的状态
   */
  isStateByMap(isState, map = this.sources[0], ...states) {
    return isState === this.constructor._mapState(states, this.sources, map, 'isState', true)
  }
  /**
   * [实例方法]输入自定义map,获得一个已经预设自定义map的处理函数，直接调用即可
   * @param  {String} isState  要查询的状态
   * @param  {Array}  map      查询状态的参数集合
   * @return {Function}        预设了map的状态获取函数，返回后的函数参数参考 getState
   */
  isStateResource(isState, map = this.sources[0]) {
    return this.isStateByMap.bind(this, isState, map)
  }
}

module.exports = complexState
