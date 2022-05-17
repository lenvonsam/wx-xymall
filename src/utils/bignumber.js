import BigNumber from 'bignumber.js'

/**
 * 数值是否正常
 * @param {*} res
 * @return {Boolean}
 */
function isNormal (res) {
  return !['Infinity', 'NaN', '-Infinity'].includes(String(res))
}

/**
 * 连续调用算法
 * @param {number} originNumber 初始两个参数的计算结果
 * @param {Array<number>} list 后续参数的集合
 * @param {String} callbackName 调用的方法名
 * @return {number} 最终返回结果
 */
function multiCall (originNumber, list = [], callbackName) {
  let result = originNumber
  list.forEach(item => {
    result = new BigNumber(result)[callbackName](item).toNumber()
  })
  return isNaN(result) ? 0 : result
}

const NumberUtil = {
  /**
   * 加
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  plus (a = 0, b = 0, ...rest) {
    const res =
      rest.length > 0
        ? multiCall(new BigNumber(a).plus(b).toNumber(), rest, 'plus')
        : new BigNumber(a).plus(b).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 减
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  minus (a, b, ...rest) {
    const res =
      rest.length > 0
        ? multiCall(new BigNumber(a).minus(b).toNumber(), rest, 'minus')
        : new BigNumber(a).minus(b).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 乘
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  times (a, b, ...rest) {
    a = a || 0
    b = b || 0
    const res =
      rest.length > 0
        ? multiCall(new BigNumber(a).times(b).toNumber(), rest, 'times')
        : new BigNumber(a).times(b).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 除
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  div (a, b, ...rest) {
    a = Number(a)
    b = Number(b)
    const res =
      rest.length > 0 ? multiCall(new BigNumber(a).div(b).toNumber(), rest, 'div') : new BigNumber(a).div(b).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 除-取整
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  idiv (a, b) {
    a = Number(a)
    b = Number(b)
    const res = new BigNumber(a).idiv(b).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 除-取余
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  mod (a, b) {
    a = Number(a)
    b = Number(b)
    const res = new BigNumber(a).mod(b).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 指数运算
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  pow (a, index) {
    a = Number(a)
    index = Number(index)
    const res = new BigNumber(a).pow(index).toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 开平方
   * @param {number} a
   * @param {number} b
   * @param {Array<number>} [rest]
   * @return {number}
   */
  sqrt (a) {
    a = Number(a)
    const res = new BigNumber(a).sqrt().toNumber()
    return isNormal(res) ? res : 0
  },
  /**
   * 处理精度
   * @param {*} number
   * @param {*} decimalPlaces
   */
  toFixed (number, decimalPlaces = 4) {
    return +new BigNumber(number).toFixed(decimalPlaces, 1)
  },
  /**
   * 处理精度
   * @param {*} number
   * @param {*} decimalPlaces
   */
  toFixedHalfUp (number, decimalPlaces = 4) {
    return +new BigNumber(number).toFixed(decimalPlaces, BigNumber.ROUND_HALF_UP)
  },
  /**
   * 处理精度（仅用于显示，内部计算用toFixed）
   * @param {*} number
   * @param {*} decimalPlaces
   */
  toShow (number, decimalPlaces = 4) {
    return new BigNumber(number).toFixed(decimalPlaces, 1)
  }
}

export default NumberUtil
