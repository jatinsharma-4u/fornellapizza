import { optionsFor } from '../data/products'

export const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const defaultOptions = (product) => {
  const o = optionsFor(product)
  return {
    size: o.sizes?.[0]?.id ?? null,
    crust: o.crusts?.[0]?.id ?? null,
    extras: [],
  }
}

export const unitPrice = (product, options = {}) => {
  const o = optionsFor(product)
  const size = o.sizes?.find((s) => s.id === options.size)
  const crust = o.crusts?.find((c) => c.id === options.crust)
  const extras = (o.extras ?? []).filter((e) => options.extras?.includes(e.id))
  return product.price + (size?.delta ?? 0) + (crust?.delta ?? 0) + extras.reduce((s, e) => s + e.delta, 0)
}

export const describeOptions = (product, options = {}) => {
  const o = optionsFor(product)
  const parts = []
  const size = o.sizes?.find((s) => s.id === options.size)
  if (size) parts.push(`${size.name}${size.detail ? ` ${size.detail}` : ''}`)
  const crust = o.crusts?.find((c) => c.id === options.crust)
  if (crust) parts.push(crust.name)
  ;(o.extras ?? []).filter((e) => options.extras?.includes(e.id)).forEach((e) => parts.push(`+ ${e.name}`))
  return parts.join(' · ')
}

export const lineKey = (id, options = {}) =>
  [id, options.size ?? '', options.crust ?? '', [...(options.extras ?? [])].sort().join('+'), options.custom ?? ''].join('|')

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
