import { NextResponse } from "next/server";
import careerData from "@/data/career.json";

// Revalidate every 24 hours so a new deployment picks up JSON changes quickly
export const revalidate = 86400;

export function GET() {
  return NextResponse.json(careerData);
}

