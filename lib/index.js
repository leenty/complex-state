class complexState {
  constructor(sources) {
    this.sources = sources
  }
  /**
   * 错误处理
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
   * 解码参数
   * @param  {Array} states  入参集合
   * @param  {Boolean} silent 是否屏蔽错误
   * @return {Object}        标准参数集合
   */
  static _decodeStates(states, sourceHead, silent) {
    const newStates = {}
    // 如果参数只有一个且为一个对象
    if (states.length === 1 && states[0].constructor === Object) {
      sourceHead.forEach(map => {
        if (states[0].hasOwnProperty(map))
          newStates[map] = states[0][map]
      })
    // 否则，视为多参数方式传入
    } else {
      sourceHead.forEach((map, index) => {
        if (index < states.length) {
          newStates[map] = states[index]
        }
      })
    }
    // 如果解析结果为空
    if (JSON.stringify(newStates) === '{}') {
      return this._stateMapError('无可用入参', silent)
    }
    return newStates
  }
  /**
   * 查询预定义状态
   * @param  {Object} stateObj 查询参数对象
   * @param  {Array} sources   预定义状态集合
   * @param  {Array} map       自定义查询顺序集合
   * @param  {Boolean} silent  是否在控制台抛出错误
   * @return {[type]}          [description]
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
      const firstSource = resultSources[0]
      const firstResult = firstSource[firstSource.length - 1]
      this._stateMapError(`查询到多个结果，返回第一个结果【${firstResult}】。请及时纠正重复内容。`, silent)
    }
    return resultSources[0]
  }
  /**
   * 过滤出符合条件的项
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
      if (index === 0){
        return true
      }
      // 如果不存在当前字段(源里面当前字段为空),则返回
      // if (!source[sourceIndex]) {
      //   return false
      // }
      if (source[sourceIndex] && source[sourceIndex].constructor === Array) {
        return source[sourceIndex].includes(states)
      } else {
        return source[sourceIndex] === states
      }
    })
  }
   // * @param  {Boolean} silent 是否屏蔽错误
  static _mapState(states, sources, map, mode = 'getState', silent) {
    const newStates = this._decodeStates(states, map, silent)
    if (newStates.constructor === Object) {
      const realMap = sources[0]
      const resultState = this._findState(newStates, sources, realMap, silent)
      if (!resultState) {
        return
      }
      if (mode === 'getState') {
        return resultState.slice(-1)[0]
      } else {
        return resultState.slice(-2, -1)[0]
      }
    }
    return
  }
  /**
   * 获得预定义的状态
   * @param  {String|Boolean|Number} states 查询状态的参数条件
   * @return {result}                             返回预定义的状态
   */
  getState(...states) {
    const map = this.sources[0]
    return this.constructor._mapState(states, this.sources, map, 'getState', false)
  }
  /**
   * 通过自定义map,获得预定义的状态
   * @param  {Array}                       map    自定义判断流程
   * @param  {String|Boolean|Number} states 参与判断的参数集合
   * @return {result}                             返回预定义的状态
   */
  getStateByMap(map, ...states) {
    return this.constructor._mapState(states, this.sources, map, 'getState', false)
  }
  /**
   * 通过手动覆盖预定义map,获得预定义状态
   * @param  {Array} map    用于覆盖的预定义map
   * @return {Function}     预设了map的状态获取函数
   */
  getStateResource(map = this.sources[0]) {
    return this.getStateByMap.bind(this, map)
  }
  isState(isState, ...states) {
    const map = this.sources[0]
    return isState === this.constructor._mapState(states, this.sources, map, 'isState', true)
  }
  isStateByMap(isState, map = this.sources[0], ...states) {
    return isState === this.constructor._mapState(states, this.sources, map, 'isState', true)
  }
  isStateResource(isState, map = this.sources[0]) {
    return this.isStateByMap.bind(this, isState, map)
  }
}

module.exports = complexState
