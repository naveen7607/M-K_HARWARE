import OpenAI from "openai";
import { env } from "../config/env.js";
import { Product } from "../models/product.model.js";

function getOpenAIClient() {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export async function answerCustomerQuestion(message: string) {
  const products = await Product.find({ isActive: true })
    .select("name category brand price stockQuantity description")
    .limit(20)
    .lean();

  const client = getOpenAIClient();

  if (!client) {
    const stockLine = products
      .slice(0, 5)
      .map((product) => `${product.name} by ${product.brand} is available at Rs. ${product.price}`)
      .join("; ");

    return {
      answer:
        stockLine ||
        "Please call or WhatsApp the shop for latest stock and price. I can help with product availability, cement, electrical, hardware, and agriculture equipment inquiries.",
      source: "fallback"
    };
  }

  const completion = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful sales assistant for M/S Manikyam Agriculture Hardware, Electrical & Cement. Answer briefly, recommend relevant products, and encourage inquiries for latest stock and pricing."
      },
      {
        role: "user",
        content: `Customer question: ${message}\n\nAvailable catalog summary: ${JSON.stringify(products)}`
      }
    ],
    temperature: 0.4
  });

  return {
    answer: completion.choices[0]?.message?.content ?? "Please contact the shop for assistance.",
    source: "openai"
  };
}

export async function recommendProducts(query: string) {
  const regex = new RegExp(query.split(/\s+/).filter(Boolean).join("|"), "i");
  return Product.find({
    isActive: true,
    $or: [{ name: regex }, { brand: regex }, { category: regex }, { description: regex }]
  })
    .select("name imageUrl category brand price stockQuantity sku")
    .limit(8)
    .lean();
}

export async function generateFaqs() {
  return [
    {
      question: "Do you provide current cement prices?",
      answer: "Yes. Cement prices change frequently, so send an inquiry or call the shop for the latest rate."
    },
    {
      question: "Can I check stock before visiting?",
      answer: "Yes. Use the product inquiry option or WhatsApp button to confirm availability."
    },
    {
      question: "Do you sell agriculture equipment?",
      answer: "Yes. The catalog includes sprayers, pumps, pipes, fittings, and common farm hardware."
    },
    {
      question: "Can staff manage inventory online?",
      answer: "Yes. Staff and admins can update stock and see low-stock warnings."
    }
  ];
}
