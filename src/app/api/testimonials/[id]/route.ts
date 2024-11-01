import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
  testimonialEditSchema,
  EditTestimonialsRequest,
} from "@/http/testimonials/edit-testimonials";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const body = await request.json();

  const bodyValidated = testimonialEditSchema.safeParse(body);

  if (!bodyValidated.success) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
        errors: bodyValidated.error.formErrors,
      },
      { status: 400 }
    );
  }

  const testimonial = await findById(id);

  if (!testimonial) {
    return NextResponse.json(
      { message: "Testimonial not found" },
      { status: 404 }
    );
  }

  try {
    await editTestimonial(testimonial.id, bodyValidated.data);
    return NextResponse.json(
      { message: "Testimonial updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const testimonial = await findById(id);

  if (!testimonial) {
    return NextResponse.json(
      { message: "Testimonial not found" },
      { status: 404 }
    );
  }

  try {
    await deleteTestimonial(testimonial.id);
    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

async function editTestimonial(id: string, data: EditTestimonialsRequest) {
  const testimonial = await prisma.testimonial.update({
    where: {
      id,
    },
    data: {
      description: data.description,
    },
  });
  return testimonial;
}

async function deleteTestimonial(id: string) {
  const testimonial = await prisma.testimonial.delete({
    where: { id },
  });
  return testimonial;
}

async function findById(id?: string) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });
  return testimonial;
}
