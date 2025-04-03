import { NextResponse } from "next/server";
import schools from "@/data/schools";
import { School } from "@/types/school";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  const body = await request.json();

  if (!schools[id]) {
    return NextResponse.json({ message: "School not found" }, { status: 404 });
  }

  const updatedSchool: School = { ...schools[id], ...body };
  schools[id] = updatedSchool; // In-memory update

  return NextResponse.json(updatedSchool);
}
