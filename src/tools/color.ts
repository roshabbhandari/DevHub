export type Rgb = { r: number; g: number; b: number }
export type Hsl = { h: number; s: number; l: number }

export function hexToRgb(input: string): Rgb {
  const value = input.trim().replace(/^#/, '')
  const expanded = value.length === 3 ? value.split('').map((part) => part + part).join('') : value
  if (!/^[\da-f]{6}$/i.test(expanded)) throw new Error('Enter a 3 or 6 digit hexadecimal color.')
  return { r: parseInt(expanded.slice(0, 2), 16), g: parseInt(expanded.slice(2, 4), 16), b: parseInt(expanded.slice(4, 6), 16) }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  if ([r, g, b].some((value) => !Number.isInteger(value) || value < 0 || value > 255)) throw new Error('RGB values must be integers from 0 to 255.')
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const red = r / 255, green = g / 255, blue = b / 255
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(lightness * 100) }
  const difference = max - min
  const saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min)
  let hue = max === red ? (green - blue) / difference + (green < blue ? 6 : 0) : max === green ? (blue - red) / difference + 2 : (red - green) / difference + 4
  hue /= 6
  return { h: Math.round(hue * 360), s: Math.round(saturation * 100), l: Math.round(lightness * 100) }
}

export function contrastRatio(first: Rgb, second: Rgb): number {
  const luminance = (color: Rgb) => [color.r, color.g, color.b].map((value) => value / 255).map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
  const [a, b] = [luminance(first), luminance(second)].sort((left, right) => right - left)
  return Math.round(((a + 0.05) / (b + 0.05)) * 100) / 100
}
