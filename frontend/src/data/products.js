const products = [
  {
    _id: "6600b45a62b1d1120cf09e41",
    name: "CoolBreeze Table Fan",
    description: "A powerful and energy-efficient table fan for your home.",
    category: "fan",
    featuredImage:
      "https://images.pexels.com/photos/26611991/pexels-photo-26611991/free-photo-of-lamp-and-fan-in-room.jpeg?auto=compress&cs=tinysrgb&w=1200",
    brand: "CoolBreeze",
    colors: ["White", "Black", "Silver"],
    sizes: ["Small", "Medium", "Large"],
    variants: [
      { id: "1-1", color: "White", size: "Small", price: 29.99, stock: 10 },
      { id: "1-2", color: "White", size: "Medium", price: 29.99, stock: 10 },
      { id: "1-3", color: "White", size: "Large", price: 29.99, stock: 10 },
      { id: "1-4", color: "Black", size: "Small", price: 29.99, stock: 10 },
      { id: "1-5", color: "Black", size: "Medium", price: 29.99, stock: 10 },
      { id: "1-6", color: "Black", size: "Large", price: 29.99, stock: 10 },
      { id: "1-7", color: "Silver", size: "Small", price: 29.99, stock: 10 },
      { id: "1-8", color: "Silver", size: "Medium", price: 29.99, stock: 10 },
      { id: "1-9", color: "Silver", size: "Large", price: 29.99, stock: 10 },
    ],

    featured: true,
    price: 29.99,
  },
  {
    _id: "6600b45a62b1d1120cf09e42",
    name: "EcoCool Pedestal Fan",
    description: "Eco-friendly pedestal fan with adjustable height.",
    category: "fan",
    featuredImage:
      "https://images.pexels.com/photos/3675622/pexels-photo-3675622.jpeg?auto=compress&cs=tinysrgb&w=1200",
    brand: "EcoCool",
    colors: ["White", "Black", "Gray"],
    sizes: ["Standard", "Premium"],
    variants: [
      { id: "2-1", color: "White", size: "Standard", price: 24.99, stock: 10 },
      { id: "2-2", color: "White", size: "Premium", price: 24.99, stock: 10 },
      { id: "2-3", color: "Black", size: "Standard", price: 24.99, stock: 10 },
      { id: "2-4", color: "Black", size: "Premium", price: 24.99, stock: 10 },
      { id: "2-5", color: "Gray", size: "Standard", price: 24.99, stock: 10 },
      { id: "2-6", color: "Gray", size: "Premium", price: 24.99, stock: 10 },
    ],

    featured: true,
    price: 24.99,
  },
  {
    _id: "6600b45a62b1d1120cf09e43",
    name: "AquaChill Air Cooler",
    description:
      "Powerful air cooler for efficient cooling during hot summers.",
    category: "cooler",
    featuredImage:
      "https://i.pinimg.com/474x/8b/5e/63/8b5e633683d7d7c1cb946de1b099c986.jpg",
    brand: "AquaChill",
    colors: ["White", "Blue"],
    sizes: ["Standard", "Large"],
    variants: [
      { id: "3-1", color: "White", size: "Standard", price: 99.99, stock: 10 },
      { id: "3-2", color: "White", size: "Large", price: 99.99, stock: 10 },
      { id: "3-3", color: "Blue", size: "Standard", price: 99.99, stock: 10 },
      { id: "3-4", color: "Blue", size: "Large", price: 99.99, stock: 10 },
    ],

    featured: true,
    price: 99.99,
  },
  {
    _id: "6600b45a62b1d1120cf09e44",
    name: "BreezePro Wall Fan",
    description: "Quiet wall fan with remote control and oscillation.",
    category: "fan",
    featuredImage:
      "https://images.pexels.com/photos/3675622/pexels-photo-3675622.jpeg?auto=compress&cs=tinysrgb&w=1200",
    brand: "BreezePro",
    colors: ["White", "Gray"],
    sizes: ["Standard"],
    variants: [
      { id: "4-1", color: "White", size: "Standard", price: 39.99, stock: 10 },
      { id: "4-2", color: "Gray", size: "Standard", price: 39.99, stock: 10 },
    ],

    featured: true,
    price: 39.99,
  },
  {
    _id: "6600b45a62b1d1120cf09e45",
    name: "FrostAir Tower Fan",
    description: "Slim and powerful tower fan for modern interiors.",
    category: "fan",
    featuredImage:
      "https://images.pexels.com/photos/26611991/pexels-photo-26611991/free-photo-of-lamp-and-fan-in-room.jpeg?auto=compress&cs=tinysrgb&w=1200", // Tower fan
    brand: "FrostAir",
    colors: ["Black", "Silver"],
    sizes: ["Medium"],
    variants: [
      { id: "5-1", color: "Black", size: "Medium", price: 44.99, stock: 10 },
      { id: "5-2", color: "Silver", size: "Medium", price: 44.99, stock: 10 },
    ],
    featured: false,
    price: 44.99,
  },
  {
    _id: "6600b45a62b1d1120cf09e46",
    name: "Glacier Desert Cooler",
    description: "Large capacity desert cooler for big rooms.",
    category: "cooler",
    featuredImage:
      "https://i.pinimg.com/474x/8b/5e/63/8b5e633683d7d7c1cb946de1b099c986.jpg",
    brand: "Glacier",
    colors: ["White", "Blue"],
    sizes: ["Large"],
    variants: [
      { id: "6-1", color: "White", size: "Large", price: 149.99, stock: 10 },
      { id: "6-2", color: "Blue", size: "Large", price: 149.99, stock: 10 },
    ],

    featured: false,
    price: 149.99,
  },
  {
    _id: "6600b45a62b1d1120cf09e47",
    name: "WindFlow Stand Fan",
    description: "Adjustable stand fan with turbo mode.",
    category: "fan",
    featuredImage:
      "https://images.pexels.com/photos/3675622/pexels-photo-3675622.jpeg?auto=compress&cs=tinysrgb&w=1200",
    brand: "WindFlow",
    colors: ["White", "Black"],
    sizes: ["Standard"],
    variants: [
      { id: "7-1", color: "White", size: "Standard", price: 34.99, stock: 10 },
      { id: "7-2", color: "Black", size: "Standard", price: 34.99, stock: 10 },
    ],
    featured: false,
    price: 34.99,
  },
  {
    _id: "8",
    name: "Polar Mini Cooler",
    description: "Compact mini cooler for personal use.",
    category: "cooler",
    featuredImage:
      "https://i.pinimg.com/474x/8b/5e/63/8b5e633683d7d7c1cb946de1b099c986.jpg",
    brand: "Polar",
    colors: ["White"],
    sizes: ["Mini"],
    variants: [
      { id: "8-1", color: "White", size: "Mini", price: 59.99, stock: 10 },
    ],

    featured: false,
    price: 59.99,
  },
];

export default products;
