import { connectDatabase } from "./config/db.js";
import { Category } from "./models/category.model.js";
import { Product } from "./models/product.model.js";
import { Review } from "./models/review.model.js";
import { User } from "./models/user.model.js";

const images = {
  hardware: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
  electrical: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  cement: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
  agriculture: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
};

async function seed() {
  await connectDatabase();

  await Category.bulkWrite([
    {
      updateOne: {
        filter: { slug: "hardware" },
        update: {
          name: "Hardware",
          slug: "hardware",
          description: "Tools, fasteners, pipes, fittings, locks, and general shop hardware.",
          imageUrl: images.hardware
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { slug: "electrical" },
        update: {
          name: "Electrical",
          slug: "electrical",
          description: "Wires, switches, breakers, boards, LED lighting, and electrical accessories.",
          imageUrl: images.electrical
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { slug: "cement" },
        update: {
          name: "Cement",
          slug: "cement",
          description: "Cement, construction essentials, masonry support, and site consumables.",
          imageUrl: images.cement
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { slug: "agriculture" },
        update: {
          name: "Agriculture",
          slug: "agriculture",
          description: "Sprayers, pumps, irrigation support, farm tools, and agriculture fittings.",
          imageUrl: images.agriculture
        },
        upsert: true
      }
    }
  ]);

  await Product.bulkWrite([
    {
      updateOne: {
        filter: { sku: "HW-DRILL-001" },
        update: {
          name: "Bosch Heavy Duty Drill Machine",
          imageUrl: images.hardware,
          category: "Hardware",
          brand: "Bosch",
          stockQuantity: 14,
          price: 3499,
          description: "Reliable drill machine for masonry, metal, and wood work.",
          sku: "HW-DRILL-001",
          specifications: { power: "600W", warranty: "6 months" },
          isFeatured: true,
          lowStockThreshold: 10
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { sku: "EL-WIRE-025" },
        update: {
          name: "Finolex Copper Wire Bundle",
          imageUrl: images.electrical,
          category: "Electrical",
          brand: "Finolex",
          stockQuantity: 8,
          price: 1290,
          description: "High quality copper wire bundle for home and shop electrical work.",
          sku: "EL-WIRE-025",
          specifications: { length: "90m", type: "Copper" },
          isFeatured: true,
          lowStockThreshold: 10
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { sku: "CM-ULTRA-050" },
        update: {
          name: "UltraTech Cement Bag",
          imageUrl: images.cement,
          category: "Cement",
          brand: "UltraTech",
          stockQuantity: 120,
          price: 420,
          description: "50 kg cement bag for residential and commercial construction.",
          sku: "CM-ULTRA-050",
          specifications: { weight: "50kg", grade: "OPC/PPC" },
          isFeatured: true,
          lowStockThreshold: 25
        },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { sku: "AG-SPRAYER-016" },
        update: {
          name: "Agriculture Battery Sprayer",
          imageUrl: images.agriculture,
          category: "Agriculture",
          brand: "Kisan Pro",
          stockQuantity: 9,
          price: 2450,
          description: "16 liter battery sprayer for crop care and farm maintenance.",
          sku: "AG-SPRAYER-016",
          specifications: { capacity: "16L", battery: "12V" },
          isFeatured: true,
          lowStockThreshold: 10
        },
        upsert: true
      }
    }
  ]);

  await User.updateOne(
    { email: "owner@manikyam.local" },
    {
      fullName: "Shop Owner",
      mobile: "+919999999999",
      email: "owner@manikyam.local",
      password: "Owner@12345",
      role: "admin",
      isMobileVerified: true,
      isEmailVerified: true
    },
    { upsert: true }
  );

  await Review.deleteMany({ customerName: { $in: ["Ramesh Kumar", "Lakshmi Devi", "Anil Reddy"] } });
  await Review.insertMany([
    {
      customerName: "Ramesh Kumar",
      rating: 5,
      comment: "Good availability of electrical and cement materials with quick response.",
      isApproved: true
    },
    {
      customerName: "Lakshmi Devi",
      rating: 5,
      comment: "Helpful staff and reliable support for farm equipment purchases.",
      isApproved: true
    },
    {
      customerName: "Anil Reddy",
      rating: 4,
      comment: "Easy to ask for product prices before visiting the shop.",
      isApproved: true
    }
  ]);

  console.log("Seed data completed");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
