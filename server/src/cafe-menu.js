const categories = [
  ['hot', 'Hot'],
  ['cold-coffee', 'Cold Coffee'],
  ['milkshakes', 'Milkshakes'],
  ['mojitos', 'Mojitos'],
  ['refreshing', 'Refreshing'],
  ['bun-maska', 'Bun-Maska'],
  ['maggi', 'Maggie'],
  ['burgers', 'Burger'],
  ['fries', 'Fries'],
  ['sandwiches', 'Sandwiches'],
  ['pizza', 'Pizza'],
  ['pasta', 'Creamy Pasta'],
].map(([id, name], sortOrder) => ({ id, name, sortOrder, isActive: true }));

const item = (id, name, categoryId, price, isPopular = false) => ({
  id, name, categoryId, price, description: '', image: '', isVegetarian: true,
  isAvailable: true, isPopular, createdAt: new Date().toISOString(),
});

const simple = (categoryId, entries) => entries.map(([id, name, price, popular]) =>
  item(id, name, categoryId, price, popular));

const sized = (categoryId, entries, sizes) => entries.flatMap(([id, name, prices]) =>
  sizes.map((size, index) => item(`${id}-${size.toLowerCase()}`, `${name} (${size})`, categoryId, prices[index])));

const sizesHalfFull = ['Half', 'Full'];

const menu = [
  ...simple('hot', [
    ['full-tea', 'Full Tea', 20, true],
    ['masala-tea', 'Masala Tea', 30, true],
    ['black-coffee', 'Black Coffee', 40],
    ['hot-lemon-tea', 'Hot Lemon Tea', 30],
    ['half-hot-coffee', 'Half Hot Coffee', 30],
    ['full-hot-coffee', 'Full Hot Coffee', 50],
  ]),
  ...sized('cold-coffee', [
    ['thick-cold-coffee', 'Thick Cold-Coffee', [50, 80]],
    ['cold-coffee-crush', 'Cold-Coffee + Crush', [70, 120]],
    ['cold-coffee-ice-cream', 'Cold-Coffee + IceCream', [80, 140]],
    ['cafe-special-cold-coffee', 'Café Special Cold Coffee', [120, 170]],
  ], sizesHalfFull),
  ...sized('milkshakes', [
    ['vanilla-milkshake', 'Vanilla Milkshake', [60, 100]],
    ['pineapple-milkshake', 'Pineapple Milkshake', [70, 120]],
    ['strawberry-milkshake', 'Strawberry Milkshake', [70, 120]],
    ['mango-milkshake', 'Mango Milkshake', [70, 120]],
    ['chocolate-milkshake', 'Chocolate Milkshake', [80, 140]],
    ['oreo-milkshake', 'Oreo Milkshake', [90, 140]],
    ['kitkat-milkshake', 'Kit-Kat Milkshake', [90, 140]],
  ], sizesHalfFull),
  ...sized('mojitos', [
    ['mint-mojito', 'Mint Mojitos', [80, 140]],
    ['green-apple-mojito', 'Green Apple Mojitos', [90, 150]],
    ['blue-lagoon-mojito', 'Blue Lagoon Mojitos', [90, 150]],
    ['strawberry-mojito', 'Strawberry Mojitos', [100, 160]],
  ], sizesHalfFull),
  ...simple('refreshing', [
    ['lemon-water', 'Lemon Water', 40],
    ['lemon-soda', 'Lemon Soda', 50],
    ['lemon-ice-tea', 'Lemon Ice Tea', 50],
    ['mint-lemon-water', 'Mint Lemon Water', 50],
  ]),
  ...simple('bun-maska', [
    ['bun-maska', 'Bun-Maska', 30],
    ['bread-butter', 'Bread Butter', 30],
    ['bun-maska-jam', 'Bun-Maska + Jam', 50],
    ['bun-maska-chocolate', 'Bun-Maska + Chocolate', 50],
  ]),
  ...sized('maggi', [
    ['plain-maggi', 'Plain Maggie', [50, 80]],
    ['masala-maggi', 'Masala Maggie (Spicy)', [60, 100]],
    ['veg-masala-maggi', 'Veg Masala Maggie', [90, 140]],
    ['cheese-loaded-maggi', 'Cheese Loaded Maggie', [90, 140]],
  ], ['Single', 'Double']),
  ...simple('burgers', [
    ['alo-tikki-burger', 'Alo Tikki Burger', 60],
    ['vegetable-burger', 'Vegetable Burger', 70],
    ['veg-tandoori-burger', 'Veg Tandoori Burger', 80],
    ['paneer-burger', 'Paneer Burger', 90],
    ['cheese-burger', 'Cheese Burger', 90],
    ['cafe-special-burger', 'Cafe Sp. Burger', 120],
  ]),
  ...simple('fries', [
    ['salted-fries', 'Salted Fries', 90],
    ['peri-peri-fries', 'Peri Peri Fries (Spicy)', 120],
    ['peri-peri-cheese-fries', 'Peri Peri Cheese Fries', 150],
    ['cheese-loaded-fries', 'Cheese Loaded Fries', 130],
    ['cafe-special-fries', 'Café Special Fries', 180],
  ]),
  ...simple('sandwiches', [
    ['veg-grilled-sandwich', 'Veg Grilled Sandwich', 60],
    ['vegetable-cheese-grilled-sandwich', 'Vegetable Cheese Grilled Sandwich', 80],
    ['tandoori-vegetable-sandwich', 'Tandoori Vegetable Sandwich', 80],
    ['paneer-tandoori-sandwich', 'Paneer Tandoori Sandwich', 80],
    ['peri-peri-cheese-sandwich', 'Peri Peri Cheese Sandwich', 100],
    ['corn-cheese-sandwich', 'Corn Cheese Sandwich', 100],
    ['paneer-corn-sandwich', 'Paneer Corn Sandwich', 120],
    ['jumbo-sandwich', 'Jumbo Sandwich', 150],
  ]),
  ...sized('pizza', [
    ['vegetable-cheese-pizza', 'Vegetable Cheese Pizza', [120, 180]],
    ['cheese-corn-pizza', 'Cheese Corn Pizza', [140, 200]],
    ['paneer-corn-cheese-pizza', 'Paneer Corn Cheese Pizza', [160, 220]],
    ['paneer-tandoori-pizza', 'Paneer Tandoori Pizza', [150, 210]],
    ['margherita-pizza', 'Margherita Pizza', [140, 190]],
    ['vegetable-schezwan-pizza', 'Vegetable Schezwan Pizza', [140, 200]],
    ['cafe-special-pizza', 'Café Special Pizza', [180, 250]],
  ], ['Regular', 'Medium']),
  ...simple('pasta', [
    ['white-sauce-pasta', 'White Sauce Pasta', 120],
    ['red-sauce-pasta', 'Red Sauce Pasta', 140],
    ['cheesy-pasta', 'Cheesy Pasta', 150],
    ['pink-sauce-pasta', 'Pink Sauce Pasta', 160],
    ['peri-peri-pasta', 'Peri Peri Pasta (Spicy)', 180],
  ]),
];

export { categories, menu };
