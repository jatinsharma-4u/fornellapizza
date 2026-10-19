// Mock catalogue. Prices in USD. Images live in /public/img (transparent WebP).

export const categories = [
  { id: 'pizza', name: 'Pizza', plural: 'Pizzas', image: '/img/margherita.webp', blurb: 'Wood-fired at 450°C, 48-hour dough', tint: 'bg-tomato-50' },
  { id: 'burgers', name: 'Burgers', plural: 'Burgers', image: '/img/burger-classic.webp', blurb: 'Smashed to order on brioche', tint: 'bg-saffron-50' },
  { id: 'sides', name: 'Sides', plural: 'Sides & Wings', image: '/img/fries.webp', blurb: 'Crispy, saucy, made for sharing', tint: 'bg-cream-2' },
  { id: 'drinks', name: 'Drinks', plural: 'Cold Drinks', image: '/img/mojito.webp', blurb: 'Ice-cold sodas, teas & lemonades', tint: 'bg-basil-50' },
  { id: 'desserts', name: 'Desserts', plural: 'Desserts', image: '/img/sundae.webp', blurb: 'Gelato, cakes & sweet endings', tint: 'bg-tomato-50' },
]

// Option groups reused across products
const pizzaSizes = [
  { id: 's', label: 'S', name: 'Small', detail: '10"', delta: 0 },
  { id: 'm', label: 'M', name: 'Medium', detail: '12"', delta: 3 },
  { id: 'l', label: 'L', name: 'Large', detail: '14"', delta: 6 },
]
const crusts = [
  { id: 'classic', name: 'Classic', delta: 0 },
  { id: 'thin', name: 'Thin & Crispy', delta: 0 },
  { id: 'stuffed', name: 'Cheese-stuffed', delta: 2.5 },
]
const pizzaExtras = [
  { id: 'cheese', name: 'Extra mozzarella', delta: 1.5 },
  { id: 'basil', name: 'Fresh basil', delta: 0.5 },
  { id: 'jalapeno', name: 'Jalapeños', delta: 1 },
  { id: 'mushroom', name: 'Mushrooms', delta: 1 },
  { id: 'olives', name: 'Black olives', delta: 1 },
  { id: 'chicken', name: 'Grilled chicken', delta: 2.5 },
]
const burgerSizes = [
  { id: 'single', label: '1x', name: 'Single', detail: '1 patty', delta: 0 },
  { id: 'double', label: '2x', name: 'Double', detail: '2 patties', delta: 3 },
]
const burgerExtras = [
  { id: 'cheese', name: 'Aged cheddar', delta: 1 },
  { id: 'bacon', name: 'Smoked bacon', delta: 2 },
  { id: 'egg', name: 'Fried egg', delta: 1.5 },
  { id: 'jalapeno', name: 'Jalapeños', delta: 0.75 },
]
const drinkSizes = [
  { id: 'reg', label: 'R', name: 'Regular', detail: '350ml', delta: 0 },
  { id: 'lg', label: 'L', name: 'Large', detail: '500ml', delta: 1 },
]
const sideSizes = [
  { id: 'reg', label: 'R', name: 'Regular', detail: 'For one', delta: 0 },
  { id: 'share', label: 'XL', name: 'Sharing', detail: 'For 2–3', delta: 3.5 },
]

const p = (o) => ({ rating: 4.7, reviews: 320, kcal: 600, time: 20, tags: [], ...o })

export const products = [
  // ── Pizza ──
  p({ id: 'margherita', name: 'Margherita', category: 'pizza', price: 11.9, image: '/img/margherita.webp', short: 'San Marzano, fior di latte, basil', description: 'The one that started it all. Crushed San Marzano tomatoes, creamy fior di latte, a drizzle of extra-virgin olive oil and torn basil, blistered in our wood-fired oven.', ingredients: ['Tomato', 'Mozzarella', 'Basil', 'Olive oil'], tags: ['bestseller', 'veg'], rating: 4.9, reviews: 2140, kcal: 720, time: 18 }),
  p({ id: 'pepperoni', name: 'Pepperoni Classic', category: 'pizza', price: 13.5, image: '/img/pepperoni.webp', short: 'Double pepperoni, mozzarella', description: 'Wall-to-wall cup-and-char pepperoni that crisps into little cups of flavour, over mozzarella and our slow-cooked tomato sauce.', ingredients: ['Pepperoni', 'Mozzarella', 'Tomato', 'Oregano'], tags: ['bestseller'], rating: 4.8, reviews: 1890, kcal: 860 }),
  p({ id: 'diavola', name: 'Diavola', category: 'pizza', price: 14.5, image: '/img/diavola.webp', short: 'Spicy salami, chilli, peppers', description: 'For heat seekers: spicy Calabrian salami, roasted peppers, chilli flakes and a finishing drizzle of hot honey.', ingredients: ['Salami', 'Chilli', 'Peppers', 'Hot honey'], tags: ['spicy'], rating: 4.7, reviews: 640, kcal: 880 }),
  p({ id: 'quattro-formaggi', name: 'Quattro Formaggi', category: 'pizza', price: 14.9, image: '/img/four-cheese.webp', short: 'Mozzarella, gorgonzola, parmesan, fontina', description: 'A white pizza with four Italian cheeses melted into one glorious, golden blanket. Finished with cracked black pepper.', ingredients: ['Mozzarella', 'Gorgonzola', 'Parmesan', 'Fontina'], tags: ['veg'], rating: 4.8, reviews: 910, kcal: 940 }),
  p({ id: 'supreme', name: 'Fornella Supreme', category: 'pizza', price: 16.5, image: '/img/supreme.webp', short: 'Pepperoni, ham, olives, peppers', description: 'Our house special loaded edge to edge: pepperoni, smoked ham, black olives, peppers, red onion and mushrooms.', ingredients: ['Pepperoni', 'Ham', 'Olives', 'Peppers', 'Onion'], tags: ['new'], rating: 4.8, reviews: 512, kcal: 980 }),
  p({ id: 'caprese', name: 'Caprese', category: 'pizza', price: 13.9, image: '/img/caprese.webp', short: 'Vine tomatoes, mozzarella, pesto', description: 'Sliced vine tomatoes, creamy mozzarella and basil pesto over a light tomato base — summer on a crust.', ingredients: ['Tomato', 'Mozzarella', 'Pesto'], tags: ['veg'], rating: 4.6, reviews: 388, kcal: 690 }),
  p({ id: 'prosciutto-funghi', name: 'Prosciutto & Funghi', category: 'pizza', price: 15.5, image: '/img/ham-mushroom.webp', short: 'Cooked ham, mushrooms, mozzarella', description: 'Roasted chestnut mushrooms and sweet cooked ham over mozzarella. Comforting, classic, impossible to share.', ingredients: ['Ham', 'Mushroom', 'Mozzarella', 'Tomato'], rating: 4.7, reviews: 455, kcal: 820 }),
  p({ id: 'bbq-chicken', name: 'BBQ Chicken', category: 'pizza', price: 15.9, image: '/img/bbq-chicken.webp', short: 'Smoky chicken, peppers, red onion', description: 'Hickory BBQ base, grilled chicken thigh, roasted peppers, red onion and a scatter of fresh basil.', ingredients: ['Chicken', 'BBQ sauce', 'Peppers', 'Onion'], tags: ['bestseller'], rating: 4.8, reviews: 1022, kcal: 910 }),
  p({ id: 'garden-veggie', name: 'Garden Veggie', category: 'pizza', price: 13.5, image: '/img/veggie.webp', short: 'Zucchini, peppers, sweetcorn', description: 'Charred zucchini, yellow peppers, sweetcorn and mozzarella on a garlic-oil base. Light, bright and very green.', ingredients: ['Zucchini', 'Peppers', 'Corn', 'Mozzarella'], tags: ['veg'], rating: 4.6, reviews: 301, kcal: 640 }),
  p({ id: 'meat-feast', name: 'Meat Feast', category: 'pizza', price: 17.5, image: '/img/meat-feast.webp', short: 'Ham, salami, sausage, bacon', description: 'Four meats, zero restraint. Smoked ham, salami, Italian sausage and crispy bacon over mozzarella.', ingredients: ['Ham', 'Salami', 'Sausage', 'Bacon'], rating: 4.7, reviews: 690, kcal: 1080 }),
  p({ id: 'pesto-verde', name: 'Pesto Verde', category: 'pizza', price: 14.5, image: '/img/garden.webp', short: 'Basil pesto, rocket, cherry tomato', description: 'Basil pesto base, mozzarella, roasted cherry tomatoes and a fistful of peppery rocket added straight out of the oven.', ingredients: ['Pesto', 'Rocket', 'Tomato', 'Mozzarella'], tags: ['veg', 'new'], rating: 4.7, reviews: 214, kcal: 700 }),
  p({ id: 'capricciosa', name: 'Capricciosa', category: 'pizza', price: 15.9, image: '/img/capricciosa.webp', short: 'Ham, artichoke, mushroom, tomato', description: 'The capricious one: ham, artichokes, mushrooms, fresh tomato and olives — a little bit of everything.', ingredients: ['Ham', 'Artichoke', 'Mushroom', 'Olives'], rating: 4.6, reviews: 276, kcal: 860 }),

  // ── Burgers ──
  p({ id: 'classic-smash', name: 'Classic Smash', category: 'burgers', price: 9.9, image: '/img/burger-classic.webp', short: 'Beef, cheddar, pickles, house sauce', description: 'Two thin smashed beef patties with crispy lace edges, melted cheddar, pickles, onion and our tangy house sauce on a toasted brioche bun.', ingredients: ['Beef', 'Cheddar', 'Pickles', 'Brioche'], tags: ['bestseller'], rating: 4.9, reviews: 1650, kcal: 780, time: 12 }),
  p({ id: 'double-stack', name: 'Double Stack', category: 'burgers', price: 12.9, image: '/img/burger-double.webp', short: 'Double beef, double cheese', description: 'Twice the beef, twice the cheese, layered with lettuce, tomato and burger sauce. Bring an appetite.', ingredients: ['Beef', 'Cheddar', 'Lettuce', 'Tomato'], rating: 4.8, reviews: 820, kcal: 1120, time: 14 }),
  p({ id: 'crispy-chicken', name: 'Crispy Chicken', category: 'burgers', price: 10.5, image: '/img/burger-crispy.webp', short: 'Buttermilk chicken, slaw, mayo', description: 'Buttermilk-brined chicken thigh, fried until shatteringly crisp, with shredded lettuce and garlic mayo.', ingredients: ['Chicken', 'Lettuce', 'Garlic mayo'], tags: ['new'], rating: 4.7, reviews: 540, kcal: 820, time: 14 }),
  p({ id: 'bacon-jam', name: 'Bacon Jam', category: 'burgers', price: 12.5, image: '/img/burger-bacon.webp', short: 'Beef, bacon jam, red onion', description: 'Sweet-smoky bacon jam, aged cheddar, crispy onions and a juicy beef patty. Sticky in the best way.', ingredients: ['Beef', 'Bacon', 'Cheddar', 'Onion'], rating: 4.8, reviews: 470, kcal: 960, time: 14 }),
  p({ id: 'the-tower', name: 'The Tower', category: 'burgers', price: 15.5, image: '/img/burger-tower.webp', short: 'Triple beef, bacon, cheese', description: 'Our tallest build: three beef patties, bacon, American cheese, tomato and pickles. Comes with a steak knife.', ingredients: ['Beef', 'Bacon', 'Cheese', 'Pickles'], tags: ['spicy'], rating: 4.7, reviews: 310, kcal: 1380, time: 16 }),
  p({ id: 'smoky-bbq', name: 'Smoky BBQ', category: 'burgers', price: 11.9, image: '/img/burger-bbq.webp', short: 'Beef, BBQ sauce, cheddar', description: 'Flame-grilled beef glazed in smoky BBQ sauce, cheddar, crisp lettuce and tomato.', ingredients: ['Beef', 'BBQ sauce', 'Cheddar'], rating: 4.6, reviews: 280, kcal: 880, time: 12 }),
  p({ id: 'southern-chicken', name: 'Southern Chicken', category: 'burgers', price: 11.5, image: '/img/burger-chicken.webp', short: 'Spiced fried chicken, pickles', description: 'Nashville-spiced fried chicken, crunchy pickles and comeback sauce on a soft potato bun.', ingredients: ['Chicken', 'Pickles', 'Spice'], tags: ['spicy'], rating: 4.7, reviews: 366, kcal: 840, time: 14 }),
  p({ id: 'cheese-lover', name: 'Cheese Lover', category: 'burgers', price: 10.9, image: '/img/burger-cheese.webp', short: 'Beef, triple cheese melt', description: 'A thick beef patty under a molten blanket of cheddar, Swiss and smoked gouda.', ingredients: ['Beef', 'Cheddar', 'Swiss', 'Gouda'], rating: 4.6, reviews: 254, kcal: 910, time: 12 }),

  // ── Sides ──
  p({ id: 'classic-fries', name: 'Classic Fries', category: 'sides', price: 3.9, image: '/img/fries.webp', short: 'Skin-on, sea salt', description: 'Skin-on fries, double-cooked for a fluffy middle and golden crunch. Finished with flaky sea salt.', ingredients: ['Potato', 'Sea salt'], tags: ['veg', 'bestseller'], rating: 4.8, reviews: 1980, kcal: 380, time: 8 }),
  p({ id: 'truffle-fries', name: 'Truffle Parmesan Fries', category: 'sides', price: 5.9, image: '/img/fries-plate.webp', short: 'Truffle oil, parmesan, herbs', description: 'Our classic fries tossed in white truffle oil, grated parmesan and chopped parsley.', ingredients: ['Potato', 'Truffle', 'Parmesan'], tags: ['veg'], rating: 4.8, reviews: 620, kcal: 460, time: 8 }),
  p({ id: 'crinkle-fries', name: 'Crinkle Fries', category: 'sides', price: 4.5, image: '/img/fries-crinkle.webp', short: 'Extra ridges, extra crunch', description: 'Crinkle-cut for maximum sauce-grabbing surface area. Seasoned with paprika salt.', ingredients: ['Potato', 'Paprika'], tags: ['veg'], rating: 4.6, reviews: 280, kcal: 410, time: 8 }),
  p({ id: 'buffalo-wings', name: 'Buffalo Wings', category: 'sides', price: 8.9, image: '/img/wings.webp', short: '8 pcs, blue cheese dip', description: 'Crispy wings tossed in classic Buffalo hot sauce, served with celery and blue cheese dip.', ingredients: ['Chicken', 'Hot sauce', 'Blue cheese'], tags: ['spicy', 'bestseller'], rating: 4.8, reviews: 940, kcal: 720, time: 15 }),
  p({ id: 'honey-garlic-wings', name: 'Honey Garlic Wings', category: 'sides', price: 8.9, image: '/img/wings-sauce.webp', short: '8 pcs, ranch dip', description: 'Sticky honey and roasted garlic glaze with a sprinkle of sesame. Served with ranch.', ingredients: ['Chicken', 'Honey', 'Garlic'], rating: 4.7, reviews: 410, kcal: 740, time: 15 }),
  p({ id: 'chicken-tenders', name: 'Chicken Tenders', category: 'sides', price: 7.5, image: '/img/tenders.webp', short: '5 pcs, honey mustard', description: 'Hand-breaded chicken tenders, golden and juicy, with honey mustard for dipping.', ingredients: ['Chicken', 'Breadcrumb'], rating: 4.7, reviews: 520, kcal: 610, time: 12 }),
  p({ id: 'chicken-bucket', name: 'Crispy Chicken Bucket', category: 'sides', price: 14.9, image: '/img/chicken-bucket.webp', short: '8 pcs bone-in, 2 dips', description: 'Eight pieces of bone-in buttermilk fried chicken, perfect for the table. Choose any two dips.', ingredients: ['Chicken', 'Buttermilk', 'Spices'], tags: ['new'], rating: 4.7, reviews: 198, kcal: 1640, time: 18 }),
  p({ id: 'loaded-nachos', name: 'Loaded Nachos', category: 'sides', price: 7.9, image: '/img/nachos.webp', short: 'Cheese, salsa, jalapeños, guac', description: 'Tortilla chips piled high with melted cheese, pico de gallo, jalapeños, sour cream and guacamole.', ingredients: ['Tortilla', 'Cheese', 'Salsa', 'Guacamole'], tags: ['veg', 'spicy'], rating: 4.6, reviews: 330, kcal: 780, time: 10 }),
  p({ id: 'potato-wedges', name: 'Potato Wedges', category: 'sides', price: 4.5, image: '/img/wedges.webp', short: 'Herb-roasted, garlic dip', description: 'Chunky wedges roasted with rosemary and garlic, served with a creamy garlic dip.', ingredients: ['Potato', 'Rosemary', 'Garlic'], tags: ['veg'], rating: 4.5, reviews: 190, kcal: 420, time: 10 }),

  // ── Drinks ──
  p({ id: 'iced-cola', name: 'Iced Cola', category: 'drinks', price: 2.9, image: '/img/cola.webp', short: 'Over ice with lemon', description: 'Ice-cold cola poured over crushed ice with a wheel of fresh lemon.', ingredients: ['Cola', 'Ice', 'Lemon'], tags: ['bestseller'], rating: 4.7, reviews: 1200, kcal: 140, time: 2 }),
  p({ id: 'virgin-mojito', name: 'Virgin Mojito', category: 'drinks', price: 4.9, image: '/img/mojito.webp', short: 'Lime, mint, soda', description: 'Muddled fresh mint and lime with cane sugar, topped up with sparkling soda.', ingredients: ['Lime', 'Mint', 'Soda'], tags: ['new'], rating: 4.8, reviews: 560, kcal: 110, time: 4 }),
  p({ id: 'classic-lemonade', name: 'Classic Lemonade', category: 'drinks', price: 3.9, image: '/img/lemonade.webp', short: 'Fresh-squeezed, mint', description: 'Fresh-squeezed lemons, a touch of cane sugar and a sprig of mint. Tart, bright, refreshing.', ingredients: ['Lemon', 'Mint', 'Cane sugar'], rating: 4.7, reviews: 480, kcal: 120, time: 3 }),
  p({ id: 'pink-lemonade', name: 'Pink Lemonade', category: 'drinks', price: 4.2, image: '/img/pink-lemonade.webp', short: 'Raspberry, lemon, soda', description: 'Raspberry purée shaken with fresh lemon juice and topped with soda.', ingredients: ['Raspberry', 'Lemon', 'Soda'], rating: 4.8, reviews: 390, kcal: 130, time: 3 }),
  p({ id: 'cherry-fizz', name: 'Cherry Fizz', category: 'drinks', price: 4.5, image: '/img/cherry-soda.webp', short: 'Black cherry, soda, ice', description: 'Black cherry syrup, fresh cherries and sparkling soda over ice.', ingredients: ['Cherry', 'Soda'], rating: 4.6, reviews: 210, kcal: 150, time: 3 }),
  p({ id: 'lime-soda', name: 'Lime Soda', category: 'drinks', price: 3.5, image: '/img/lime-soda.webp', short: 'Fresh lime, sparkling', description: 'Fresh lime juice, crushed ice and sparkling water. Sweet or salted — your call.', ingredients: ['Lime', 'Soda'], rating: 4.6, reviews: 175, kcal: 70, time: 2 }),
  p({ id: 'lemon-iced-tea', name: 'Lemon Iced Tea', category: 'drinks', price: 3.5, image: '/img/iced-tea.webp', short: 'Black tea, lemon', description: 'Cold-brewed black tea, lightly sweetened, with fresh lemon.', ingredients: ['Black tea', 'Lemon'], rating: 4.5, reviews: 160, kcal: 90, time: 2 }),
  p({ id: 'peach-iced-tea', name: 'Peach Iced Tea', category: 'drinks', price: 3.9, image: '/img/peach-tea.webp', short: 'Peach, black tea', description: 'Ripe peach purée stirred into cold-brew black tea.', ingredients: ['Peach', 'Black tea'], rating: 4.7, reviews: 240, kcal: 120, time: 2 }),
  p({ id: 'strawberry-cooler', name: 'Strawberry Cooler', category: 'drinks', price: 4.9, image: '/img/strawberry-cooler.webp', short: 'Strawberry, mint, soda', description: 'Crushed strawberries, mint and lime topped with soda — summer in a glass.', ingredients: ['Strawberry', 'Mint', 'Lime'], tags: ['new'], rating: 4.8, reviews: 140, kcal: 140, time: 4 }),
  p({ id: 'orange-fizz', name: 'Orange Fizz', category: 'drinks', price: 4.2, image: '/img/orange-fizz.webp', short: 'Blood orange, soda', description: 'Blood orange juice, a splash of grenadine and soda in a tall glass.', ingredients: ['Orange', 'Soda'], rating: 4.6, reviews: 120, kcal: 130, time: 3 }),

  // ── Desserts ──
  p({ id: 'choco-sundae', name: 'Choco Chip Sundae', category: 'desserts', price: 5.9, image: '/img/sundae.webp', short: 'Vanilla, fudge, cherry', description: 'Vanilla gelato with chocolate chips, hot fudge, a cherry on top, served in a crisp waffle bowl.', ingredients: ['Vanilla', 'Fudge', 'Waffle'], tags: ['bestseller', 'veg'], rating: 4.9, reviews: 760, kcal: 520, time: 4 }),
  p({ id: 'strawberry-gelato', name: 'Strawberry Gelato Bowl', category: 'desserts', price: 6.5, image: '/img/gelato-bowl.webp', short: 'Strawberry gelato, fresh berries', description: 'Three scoops of strawberry gelato with fresh strawberries and mint in a waffle bowl.', ingredients: ['Strawberry', 'Gelato', 'Waffle'], tags: ['veg'], rating: 4.8, reviews: 410, kcal: 460, time: 4 }),
  p({ id: 'berry-sundae', name: 'Berry Sundae', category: 'desserts', price: 6.2, image: '/img/sundae-glass.webp', short: 'Berry ripple, wafer', description: 'Layers of berry-ripple gelato, cream and wafer in a classic sundae glass.', ingredients: ['Berries', 'Gelato', 'Cream'], tags: ['veg'], rating: 4.7, reviews: 230, kcal: 490, time: 4 }),
  p({ id: 'strawberry-cone', name: 'Strawberry Cone', category: 'desserts', price: 3.5, image: '/img/cone.webp', short: 'Real strawberry gelato', description: 'A generous scoop of strawberry gelato with real fruit pieces in a crisp waffle cone.', ingredients: ['Strawberry', 'Waffle cone'], tags: ['veg'], rating: 4.6, reviews: 180, kcal: 260, time: 2 }),
  p({ id: 'chocolate-cake', name: 'Triple Chocolate Cake', category: 'desserts', price: 5.5, image: '/img/cake-slice.webp', short: 'Dark chocolate ganache', description: 'Three layers of dark chocolate sponge with silky ganache and chocolate shavings.', ingredients: ['Chocolate', 'Ganache'], tags: ['veg'], rating: 4.8, reviews: 350, kcal: 560, time: 2 }),
  p({ id: 'fudge-brownie', name: 'Fudge Brownie', category: 'desserts', price: 4.5, image: '/img/brownie.webp', short: 'Warm, gooey, glazed', description: 'A warm, gooey chocolate brownie with a glossy fudge glaze. Add gelato on the side.', ingredients: ['Chocolate', 'Butter'], tags: ['veg', 'new'], rating: 4.7, reviews: 290, kcal: 480, time: 3 }),
]

// Vegetarian flag drives the veg / non-veg marks and filter. Drinks & desserts are vegetarian.
products.forEach((x) => {
  x.veg = x.tags.includes('veg') || x.category === 'drinks' || x.category === 'desserts'
})

// Demo stock: these dishes have run out for today (shown greyed out, can't be added).
export const soldOutIds = ['capricciosa', 'chicken-bucket', 'strawberry-cooler', 'berry-sundae']
products.forEach((x) => {
  x.soldOut = soldOutIds.includes(x.id)
})

export const optionsFor = (product) => {
  switch (product.category) {
    case 'pizza':
      return { sizes: pizzaSizes, crusts, extras: pizzaExtras }
    case 'burgers':
      return { sizes: burgerSizes, extras: burgerExtras }
    case 'drinks':
      return { sizes: drinkSizes }
    case 'sides':
      return { sizes: sideSizes }
    default:
      return {}
  }
}

export const getProduct = (id) => products.find((x) => x.id === id)
export const byCategory = (cat) => products.filter((x) => x.category === cat)
export const bestsellers = products.filter((x) => x.tags.includes('bestseller'))

export const tagMeta = {
  bestseller: { label: 'Bestseller', className: 'bg-ink text-cream' },
  new: { label: 'New', className: 'bg-saffron text-ink' },
  spicy: { label: 'Spicy', className: 'bg-tomato text-white' },
  veg: { label: 'Veg', className: 'bg-basil text-white' },
}
