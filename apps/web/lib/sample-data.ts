export type CategoryName = "Hardware" | "Electrical" | "Cement" | "Agriculture";

export type Product = {
  _id: string;
  name: string;
  imageUrl: string;
  category: CategoryName;
  brand: string;
  stockQuantity: number;
  price: number;
  description: string;
  sku: string;
  isFeatured?: boolean;
  ratingAverage?: number;
};

export const categories = [
  {
    name: "Hardware",
    description: "Tools, fasteners, locks, plumbing support, pipes, and fittings.",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Electrical",
    description: "Wires, switches, breakers, boards, LED lights, and accessories.",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Cement",
    description: "Cement bags, masonry essentials, and site consumables.",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Agriculture",
    description: "Farm tools, sprayers, pumps, irrigation support, and fittings.",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
  }
] as const;

export const products: Product[] = [
  {
    _id: "demo-drill",
    name: "Bosch Heavy Duty Drill Machine",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
    category: "Hardware",
    brand: "Bosch",
    stockQuantity: 14,
    price: 3499,
    description: "Reliable drill machine for masonry, metal, and wood work.",
    sku: "HW-DRILL-001",
    isFeatured: true,
    ratingAverage: 4.8
  },
  {
    _id: "demo-wire",
    name: "Finolex Copper Wire Bundle",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    category: "Electrical",
    brand: "Finolex",
    stockQuantity: 8,
    price: 1290,
    description: "High quality copper wire bundle for home and shop electrical work.",
    sku: "EL-WIRE-025",
    isFeatured: true,
    ratingAverage: 4.7
  },
  {
    _id: "demo-cement",
    name: "UltraTech Cement Bag",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    category: "Cement",
    brand: "UltraTech",
    stockQuantity: 120,
    price: 420,
    description: "50 kg cement bag for residential and commercial construction.",
    sku: "CM-ULTRA-050",
    isFeatured: true,
    ratingAverage: 4.9
  },
  {
    _id: "demo-sprayer",
    name: "Agriculture Battery Sprayer",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    category: "Agriculture",
    brand: "Kisan Pro",
    stockQuantity: 9,
    price: 2450,
    description: "16 liter battery sprayer for crop care and farm maintenance.",
    sku: "AG-SPRAYER-016",
    isFeatured: true,
    ratingAverage: 4.6
  },
  {
    _id: "demo-switch",
    name: "Anchor Modular Switch Set",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
    category: "Electrical",
    brand: "Anchor",
    stockQuantity: 42,
    price: 180,
    description: "Durable modular switch set for residential electrical boards.",
    sku: "EL-SWITCH-010",
    ratingAverage: 4.5
  },
  {
    _id: "demo-pipe",
    name: "PVC Pipe 1 Inch",
    imageUrl: "https://images.unsplash.com/photo-1581094480465-4e6c25fb4a52?auto=format&fit=crop&w=1200&q=80",
    category: "Hardware",
    brand: "Supreme",
    stockQuantity: 65,
    price: 260,
    description: "Strong PVC pipe for plumbing, irrigation, and construction use.",
    sku: "HW-PIPE-001",
    ratingAverage: 4.4
  }
];

export const reviews = [
  {
    name: "Ramesh Kumar",
    rating: 5,
    comment: "Good availability of electrical and cement materials with quick response."
  },
  {
    name: "Lakshmi Devi",
    rating: 5,
    comment: "Helpful staff and reliable support for farm equipment purchases."
  },
  {
    name: "Anil Reddy",
    rating: 4,
    comment: "Easy to ask for product prices before visiting the shop."
  }
];
