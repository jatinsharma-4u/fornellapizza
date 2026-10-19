export const brand = {
  name: 'Fornella',
  tagline: 'Pizza Café',
  phone: '+1 (555) 014-2290',
  email: 'hello@fornella.cafe',
  address: '218 Mulberry Street, New York, NY 10012',
  hours: [
    { days: 'Mon – Thu', time: '11:00 – 22:00' },
    { days: 'Fri – Sat', time: '11:00 – 00:00' },
    { days: 'Sunday', time: '12:00 – 21:00' },
  ],
  freeDeliveryOver: 25,
  deliveryFee: 2.99,
  social: { instagram: '@fornella.cafe' },
}

// Hero artwork — swap `image` for a new cut-out (transparent PNG/WebP, roughly square).
// The stage uses object-fit: contain, so any proportions stay fully visible.
export const hero = {
  image: '/img/hero-pizza.webp',
  alt: 'Margherita pizza with fresh basil, olives and mozzarella',
}

export const offers = [
  { id: 'bogo', title: 'Buy 1, get 1 free', subtitle: 'Every Tuesday on all Medium pizzas', code: 'TWOSDAY', tone: 'tomato', image: '/img/pepperoni.webp', expires: 'Every Tuesday', badge: 'Weekly' },
  { id: 'first', title: '20% off your first order', subtitle: 'New here? Welcome to the family.', code: 'HELLO20', tone: 'saffron', image: '/img/margherita.webp', expires: 'New customers', badge: 'Welcome' },
  { id: 'combo', title: 'Burger + Fries + Drink', subtitle: 'Any burger combo for just $13.90', code: 'COMBO', tone: 'cream', image: '/img/burger-classic.webp', expires: 'Ends Sunday', badge: 'Combo' },
  { id: 'free-del', title: 'Free delivery over $25', subtitle: 'No code needed — it’s automatic.', code: null, tone: 'basil', image: '/img/fries.webp', expires: 'Always on', badge: 'Always' },
]

export const promoCodes = {
  HELLO20: { type: 'percent', value: 20, label: '20% off first order' },
  FORNO10: { type: 'percent', value: 10, label: '10% off' },
  TWOSDAY: { type: 'flat', value: 8, label: '$8 off (BOGO credit)' },
  COMBO: { type: 'flat', value: 3, label: '$3 combo saving' },
}

export const combos = [
  { id: 'date-night', name: 'Date Night', items: ['Any Medium pizza', 'Truffle fries', '2 Lemonades'], price: 24.9, was: 31.4, image: '/img/caprese.webp' },
  { id: 'family', name: 'Family Feast', items: ['2 Large pizzas', 'Buffalo wings', '4 Drinks', 'Brownie'], price: 49.9, was: 64.3, image: '/img/supreme.webp' },
  { id: 'lunch', name: 'Lunch Box', items: ['Classic Smash', 'Classic fries', 'Iced cola'], price: 13.9, was: 16.7, image: '/img/burger-classic.webp' },
]

export const testimonials = [
  { name: 'Maya Robinson', role: 'Regular since 2019', text: 'The Margherita is genuinely the best in the city. Blistered crust, proper fior di latte — and it arrives hot every single time.', rating: 5, dish: 'Margherita' },
  { name: 'Jordan Kim', role: 'Ordered 48 times', text: 'Tracking is spot-on and the rider always calls ahead. Bacon Jam burger with truffle fries is my Friday ritual.', rating: 5, dish: 'Bacon Jam' },
  { name: 'Priya Shah', role: 'Office lunch hero', text: 'We order the Family Feast for team lunches. Everyone fights over the Pesto Verde. Great vegetarian options too.', rating: 5, dish: 'Pesto Verde' },
  { name: 'Diego Morales', role: 'Weekend pizza night', text: 'Build-your-own is dangerously fun. Love that you can see the pizza come together before you order.', rating: 4, dish: 'Custom pizza' },
  { name: 'Hannah Lee', role: 'Dine-in regular', text: 'The room is loud in the best way and the Diavola has real heat. Staff remember our usual order.', rating: 5, dish: 'Diavola' },
  { name: 'Marcus Bell', role: 'Late-night orders', text: 'Open till midnight on Fridays and still perfect at 11:45pm. Wings are sticky, crispy, perfect.', rating: 5, dish: 'Honey Garlic Wings' },
  { name: 'Sofia Romano', role: 'Born in Naples', text: 'I am picky about pizza. This dough is properly proved — light, airy and charred in the right places.', rating: 5, dish: 'Quattro Formaggi' },
  { name: 'Ethan Clarke', role: 'Family of five', text: 'Kids love the cheese pizza, we love the Meat Feast, and the Tuesday BOGO deal makes it a weekly thing.', rating: 4, dish: 'Meat Feast' },
]

// Demo account so the sign-in flow can be tried end-to-end (frontend-only mock).
export const demoUser = {
  name: 'Alex Rivera',
  email: 'demo@fornella.cafe',
  password: 'pizza123',
  phone: '(555) 010-4477',
  joined: '2024-03-02T12:00:00',
  points: 112,
}

const order = (o) => ({ mode: 'delivery', address: '218 Mulberry Street, Apt 4B', payment: 'card', when: 'ASAP', customer: 'Alex Rivera', ...o })
export const pastOrders = [
  order({ id: 'FN-20481', date: '2026-10-14T19:42:00', status: 'delivered', subtotal: 32.2, discount: 0, delivery: 0, tax: 2.58, total: 34.78, items: [{ id: 'margherita', qty: 1, price: 11.9, options: { size: 's', crust: 'classic', extras: [] } }, { id: 'buffalo-wings', qty: 1, price: 8.9, options: { size: 'reg' } }, { id: 'pink-lemonade', qty: 2, price: 4.2, options: { size: 'reg' } }] }),
  order({ id: 'FN-20377', date: '2026-10-08T13:05:00', status: 'delivered', mode: 'pickup', address: '218 Mulberry Street (SoHo)', payment: 'apple', subtotal: 16.7, discount: 0, delivery: 0, tax: 1.34, total: 18.04, items: [{ id: 'classic-smash', qty: 1, price: 9.9, options: { size: 'single', extras: [] } }, { id: 'truffle-fries', qty: 1, price: 5.9, options: { size: 'reg' } }, { id: 'iced-cola', qty: 1, price: 2.9, options: { size: 'reg' } }] }),
  order({ id: 'FN-20112', date: '2026-09-27T20:18:00', status: 'cancelled', payment: 'cash', subtotal: 17.5, discount: 0, delivery: 2.99, tax: 1.4, total: 21.89, items: [{ id: 'meat-feast', qty: 1, price: 17.5, options: { size: 's', crust: 'classic', extras: [] } }] }),
  order({ id: 'FN-19988', date: '2026-09-19T18:51:00', status: 'delivered', subtotal: 44.2, discount: 4.42, delivery: 0, tax: 3.18, total: 42.96, items: [{ id: 'supreme', qty: 1, price: 16.5, options: { size: 's', crust: 'classic', extras: [] } }, { id: 'bbq-chicken', qty: 1, price: 15.9, options: { size: 's', crust: 'classic', extras: [] } }, { id: 'choco-sundae', qty: 2, price: 5.9, options: {} }] }),
]

export const notifications = [
  { id: 1, title: 'Tuesday is BOGO day', body: 'Buy any Medium pizza, get a second free with code TWOSDAY.', time: '2h ago', kind: 'deal' },
  { id: 2, title: 'Your order FN-20481 was delivered', body: 'Hope it was delicious! Rate your order to earn 10 bonus points.', time: '5 days ago', kind: 'order' },
  { id: 3, title: 'New on the menu', body: 'Pesto Verde pizza and Strawberry Cooler just landed.', time: '1 week ago', kind: 'news' },
  { id: 4, title: 'You’re 38 points from a free pizza', body: 'Every 150 Fornella Club points unlocks a free Medium pizza.', time: '2 weeks ago', kind: 'reward' },
]

export const locations = [
  { id: 'soho', name: 'SoHo (Flagship)', address: '218 Mulberry Street, NY 10012', phone: '+1 (555) 014-2290', open: true },
  { id: 'brooklyn', name: 'Williamsburg', address: '91 Bedford Ave, Brooklyn, NY 11211', phone: '+1 (555) 014-3381', open: true },
  { id: 'uws', name: 'Upper West Side', address: '402 Amsterdam Ave, NY 10024', phone: '+1 (555) 014-7712', open: false },
]

export const faqs = [
  { q: 'How long does delivery take?', a: 'Most orders arrive in 25–35 minutes. You can watch every step live on the order tracking page — from oven to doorstep.' },
  { q: 'Is delivery free?', a: 'Delivery is free on orders over $25. Below that, a flat $2.99 fee applies. Pickup is always free.' },
  { q: 'Do you have vegetarian or vegan options?', a: 'Yes — look for the green Veg tag. Any pizza can be made with vegan mozzarella for $1.50 by adding a note at checkout.' },
  { q: 'Can I schedule an order for later?', a: 'Absolutely. At checkout choose “Schedule” and pick any 15-minute slot up to 7 days ahead.' },
  { q: 'What payment methods do you accept?', a: 'All major cards, Apple Pay, Google Pay and cash on delivery.' },
  { q: 'Do you cater events?', a: 'We do! For orders of 10+ pizzas, contact us at least 48 hours ahead and we’ll set you up with a catering menu.' },
  { q: 'How do Fornella Club points work?', a: 'Earn 1 point per $1. Every 150 points unlocks a free Medium pizza. Points never expire while your account is active.' },
]

export const gallery = [
  '/img/photos/oven.webp',
  '/img/photos/sharing.webp',
  '/img/photos/board.webp',
  '/img/photos/interior.webp',
  '/img/photos/slices.webp',
  '/img/photos/greens.webp',
  '/img/photos/rustic.webp',
  '/img/photos/friends.webp',
]
