import { NextResponse } from "next/server";

const dummyProducts = [
  {
    id: "1",
    name: "Whole Milk",
    price: 3.99,
    unit: "liter",
    category: "Milk",
    description: "Fresh whole milk",
    inStock: true,
    supplier: "Farm Fresh Dairy",
  },
  {
    id: "2",
    name: "Greek Yogurt",
    price: 4.49,
    unit: "cup",
    category: "Yogurt",
    description: "Creamy Greek yogurt",
    inStock: true,
    supplier: "Farm Fresh Dairy",
  },
  {
    id: "3",
    name: "Cheddar Cheese",
    price: 5.99,
    unit: "kg",
    category: "Cheese",
    description: "Aged cheddar cheese",
    inStock: true,
    supplier: "Cheese Masters",
  },
];

export async function GET() {
  return NextResponse.json(dummyProducts);
}
