import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { getProduct } from '../data/products'
import { brand, demoUser, pastOrders, promoCodes } from '../data/site'
import { flyToCart } from '../lib/flyToCart'
import { lineKey, unitPrice } from '../lib/format'

const StoreContext = createContext(null)
const STORAGE_KEY = 'fornella:v2'

const initialState = {
  cart: [], // { key, id, qty, options, price, meta? }
  promo: null,
  favorites: ['margherita', 'classic-smash', 'pink-lemonade'],
  user: null,
  accounts: [demoUser], // mock "user database" for the demo sign-in
  orders: pastOrders,
  notificationsRead: false,
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState
  } catch {
    return initialState
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'cart/add': {
      const { line } = action
      const existing = state.cart.find((l) => l.key === line.key)
      const cart = existing ? state.cart.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l)) : [...state.cart, line]
      return { ...state, cart }
    }
    case 'cart/qty':
      return { ...state, cart: state.cart.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l)).filter((l) => l.qty > 0) }
    case 'cart/remove':
      return { ...state, cart: state.cart.filter((l) => l.key !== action.key) }
    case 'cart/clear':
      return { ...state, cart: [], promo: null }
    case 'promo/set':
      return { ...state, promo: action.code }
    case 'fav/toggle': {
      const has = state.favorites.includes(action.id)
      return { ...state, favorites: has ? state.favorites.filter((f) => f !== action.id) : [...state.favorites, action.id] }
    }
    case 'auth/register':
      return { ...state, accounts: [...state.accounts, action.account], user: publicUser(action.account) }
    case 'auth/login':
      return { ...state, user: action.user }
    case 'auth/logout':
      return { ...state, user: null }
    case 'auth/update': {
      const user = { ...state.user, ...action.patch }
      return { ...state, user, accounts: state.accounts.map((a) => (a.email === state.user.email ? { ...a, ...action.patch } : a)) }
    }
    case 'auth/delete':
      return { ...state, user: null, accounts: state.accounts.filter((a) => a.email !== state.user?.email) }
    case 'orders/add':
      return { ...state, orders: [action.order, ...state.orders] }
    case 'orders/cancel':
      return { ...state, orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: 'cancelled' } : o)) }
    case 'notifications/read':
      return { ...state, notificationsRead: true }
    default:
      return state
  }
}

const publicUser = ({ password: _password, ...rest }) => rest
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — state stays in memory */
    }
  }, [state])

  /** Adds a line and plays the fly-to-cart animation from `from` (an image or its container). */
  const addToCart = useCallback((id, options = {}, qty = 1, { meta, from } = {}) => {
    const product = meta ?? getProduct(id)
    const price = meta ? meta.price : unitPrice(product, options)
    dispatch({ type: 'cart/add', line: { key: lineKey(id, { ...options, custom: meta?.signature }), id, qty, options, price, meta } })
    flyToCart(from, product.image, qty)
  }, [])

  const totals = useMemo(() => {
    const subtotal = state.cart.reduce((s, l) => s + l.price * l.qty, 0)
    const count = state.cart.reduce((s, l) => s + l.qty, 0)
    const promo = state.promo ? promoCodes[state.promo] : null
    const discount = promo ? (promo.type === 'percent' ? (subtotal * promo.value) / 100 : Math.min(promo.value, subtotal)) : 0
    const delivery = subtotal === 0 || subtotal - discount >= brand.freeDeliveryOver ? 0 : brand.deliveryFee
    const tax = (subtotal - discount) * 0.08
    const total = Math.max(0, subtotal - discount + delivery + tax)
    return { subtotal, count, discount, delivery, tax, total, promo }
  }, [state.cart, state.promo])

  const actions = useMemo(
    () => ({
      setQty: (key, qty) => dispatch({ type: 'cart/qty', key, qty }),
      removeLine: (key) => dispatch({ type: 'cart/remove', key }),
      clearCart: () => dispatch({ type: 'cart/clear' }),
      removePromo: () => dispatch({ type: 'promo/set', code: null }),
      toggleFavorite: (id) => dispatch({ type: 'fav/toggle', id }),
      logout: () => dispatch({ type: 'auth/logout' }),
      updateProfile: (patch) => dispatch({ type: 'auth/update', patch }),
      deleteAccount: () => dispatch({ type: 'auth/delete' }),
      cancelOrder: (id) => dispatch({ type: 'orders/cancel', id }),
      markNotificationsRead: () => dispatch({ type: 'notifications/read' }),
    }),
    [],
  )

  const value = useMemo(
    () => ({
      ...state,
      ...actions,
      totals,
      cartOpen,
      setCartOpen,
      addToCart,
      applyPromo: (code) => {
        const c = code.trim().toUpperCase()
        if (!promoCodes[c]) return false
        dispatch({ type: 'promo/set', code: c })
        return true
      },
      isFavorite: (id) => state.favorites.includes(id),
      // ── Simulated auth (frontend-only demo) ──
      login: async (email, password) => {
        await wait(700)
        const acct = state.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
        if (!acct) return { error: 'No account found with that email. Try the demo account or sign up.' }
        if (acct.password !== password) return { error: 'That password doesn’t match. Please try again.' }
        dispatch({ type: 'auth/login', user: publicUser(acct) })
        return { ok: true, user: publicUser(acct) }
      },
      register: async ({ name, email, password }) => {
        await wait(800)
        if (state.accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase()))
          return { error: 'An account with this email already exists. Sign in instead.' }
        const account = { name: name.trim(), email: email.trim(), password, phone: '', joined: new Date().toISOString(), points: 0 }
        dispatch({ type: 'auth/register', account })
        return { ok: true }
      },
      socialLogin: (provider) => dispatch({ type: 'auth/login', user: { ...publicUser(demoUser), via: provider } }),
      placeOrder: (details) => {
        const order = {
          id: `FN-${Math.floor(20500 + Math.random() * 9000)}`,
          date: new Date().toISOString(),
          status: 'active',
          subtotal: totals.subtotal,
          discount: totals.discount,
          delivery: totals.delivery,
          tax: totals.tax,
          total: totals.total,
          items: state.cart.map((l) => ({ id: l.id, qty: l.qty, meta: l.meta, options: l.options, price: l.price })),
          ...details,
        }
        dispatch({ type: 'orders/add', order })
        dispatch({ type: 'cart/clear' })
        return order
      },
    }),
    [state, actions, totals, cartOpen, addToCart],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

/** Resolve a cart/order line to display data (handles custom-built pizzas). */
// eslint-disable-next-line react-refresh/only-export-components
export const resolveLine = (line) => line.meta ?? getProduct(line.id)
