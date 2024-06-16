import { isOdd } from "./is"


/**
 * hex编解码
 * hex.encode([168, 174, 155, 255]) // -> 'a8ae9bff'
hex.decode('a8ae9bff') // -> [168, 174, 155, 255]
 */
export const hex = {
  encode(bytes:Array<any>) {
    const hex = []
    for (let i = 0, len = bytes.length; i < len; i++) {
      const byte = bytes[i]
      hex.push((byte >>> 4).toString(16))
      hex.push((byte & 0xf).toString(16))
    }
    return hex.join('')
  },
  decode(str:string) { 
    const bytes = []
    let len = str.length
    if (isOdd(len)) len--
    for (var i = 0; i < len; i += 2) {
      bytes.push(parseInt(str.substr(i, 2), 16))
    }
    return bytes
  }
}
