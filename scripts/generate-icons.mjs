import { createWriteStream } from 'fs'
import { deflateSync } from 'zlib'

function createPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function chunk(type, data) {
    const crcTable = (() => {
      const t = new Uint32Array(256)
      for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        t[n] = c
      }
      return t
    })()
    function crc32(buf) {
      let c = 0xffffffff
      for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
      return (c ^ 0xffffffff) >>> 0
    }
    const typeBytes = Buffer.from(type, 'ascii')
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crcBuf = Buffer.concat([typeBytes, data])
    const crcVal = Buffer.alloc(4)
    crcVal.writeUInt32BE(crc32(crcBuf))
    return Buffer.concat([len, typeBytes, data, crcVal])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB color type
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  // IDAT: raw scanlines
  const scanline = Buffer.alloc(1 + size * 3)
  scanline[0] = 0  // filter none
  for (let x = 0; x < size; x++) {
    scanline[1 + x * 3] = r
    scanline[2 + x * 3] = g
    scanline[3 + x * 3] = b
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => scanline))
  const compressed = deflateSync(raw)

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))])
}

// Indigo 99 102 241 = #6366f1
const r = 99, g = 102, b = 241

import { writeFileSync } from 'fs'
writeFileSync('public/icons/icon-192.png', createPNG(192, r, g, b))
writeFileSync('public/icons/icon-512.png', createPNG(512, r, g, b))
console.log('Icons generated: icon-192.png, icon-512.png')
