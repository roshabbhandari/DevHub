import { describe, expect, it } from 'vitest'
import { encodeBase64, decodeBase64, encodeUrl, decodeUrl } from './encoding'
import { formatJson } from './json'
import { testRegex } from './regex'
import { generateUuid, hashText } from './hash'
import { csvToJson, jsonToCsv } from './csv'
import { timestampToDate } from './timestamp'
import { hexToRgb, rgbToHex, rgbToHsl, contrastRatio } from './color'
import { formatXml } from './xml'
import { markdownToHtml } from './markdown'
import { formatSql } from './sql'
import { explainCron } from './cron'

describe('JSON utilities', () => {
  it('formats valid nested JSON', () => expect(formatJson('{"a":{"b":[1,2]}}')).toBe('{\n  "a": {\n    "b": [\n      1,\n      2\n    ]\n  }\n}'))
  it('minifies JSON', () => expect(formatJson('{ "a": 1 }', true)).toBe('{"a":1}'))
  it('rejects invalid and empty input', () => {
    expect(() => formatJson('{bad}')).toThrow()
    expect(() => formatJson('')).toThrow('Input is empty.')
  })
})

describe('encoding utilities', () => {
  it('round-trips Unicode Base64', () => expect(decodeBase64(encodeBase64('नमस्ते DevHub'))).toBe('नमस्ते DevHub'))
  it('handles URL Unicode and malformed values', () => {
    expect(decodeUrl(encodeUrl('hello world ✓'))).toBe('hello world ✓')
    expect(() => decodeUrl('%')).toThrow()
    expect(() => decodeBase64('%%%')).toThrow()
  })
})

describe('regex utilities', () => {
  it('matches globally and returns no matches cleanly', () => {
    expect(testRegex('dev', 'Dev dev DEV', 'gi')).toEqual(['Dev', 'dev', 'DEV'])
    expect(testRegex('missing', 'text')).toEqual([])
    expect(() => testRegex('[', 'text')).toThrow()
  })
})

describe('UUID and hashing', () => {
  it('generates valid unique UUIDs', () => {
    const values = new Set(Array.from({ length: 10 }, generateUuid))
    expect(values).toHaveLength(10)
    expect([...values].every((value) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))).toBe(true)
  })
  it('matches known SHA vectors including empty input', async () => {
    await expect(hashText('abc', 'SHA-256')).resolves.toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    await expect(hashText('abc', 'SHA-384')).resolves.toBe('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7')
    await expect(hashText('abc', 'SHA-512')).resolves.toBe('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f')
    await expect(hashText('', 'SHA-256')).resolves.toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })
})

describe('CSV, timestamp, and color utilities', () => {
  it('parses quoted CSV and serializes JSON', () => {
    expect(JSON.parse(csvToJson('name,notes\nAda,"writes, tests"'))).toEqual([{ name: 'Ada', notes: 'writes, tests' }])
    expect(jsonToCsv('[{"name":"Ada","note":"hello, world"}]')).toBe('name,note\nAda,"hello, world"')
    expect(() => csvToJson('a,"unterminated')).toThrow()
  })

  describe('additional developer tools', () => {
    it('formats valid XML and rejects malformed XML', () => {
      expect(formatXml('<root><item>DevHub</item></root>')).toContain('<item>DevHub</item>')
      expect(() => formatXml('<root>')).toThrow()
    })
    it('renders Markdown to HTML', () => expect(markdownToHtml('# DevHub')).toContain('<h1>DevHub</h1>'))
    it('formats SQL and rejects empty input', () => {
      expect(formatSql('select * from users;')).toContain('SELECT')
      expect(() => formatSql('')).toThrow('SQL input is empty.')
    })
    it('explains cron fields and rejects malformed schedules', () => {
      expect(explainCron('*/15 * * * *')).toContain('minute: */15')
      expect(() => explainCron('* *')).toThrow()
    })
  })
  it('distinguishes Unix seconds from milliseconds', () => expect(timestampToDate('0', 'seconds').toISOString()).toBe('1970-01-01T00:00:00.000Z'))
  it('converts known colors and contrast', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(rgbToHex({ r: 255, g: 0, b: 128 })).toBe('#ff0080')
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBe(21)
  })
})
