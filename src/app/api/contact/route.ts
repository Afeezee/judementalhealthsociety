import { NextResponse } from "next/server";
import { db, schema } from "@/db/client";

const TOPICS = new Set([
  "General enquiry",
  "Writing Competition",
  "Professional listing",
  "Volunteering",
  "Partnership / media",
  "Other",
]);

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please add a valid email." }, { status: 400 });
  }
  if (!TOPICS.has(topic)) {
    return NextResponse.json({ error: "Please choose a topic." }, { status: 400 });
  }
  if (message.length < 20 || message.length > 4000) {
    return NextResponse.json(
      { error: "Please write between 20 and 4,000 characters." },
      { status: 400 }
    );
  }

  await db.insert(schema.contactMessages).values({ name, email, topic, message });
  return NextResponse.json({ ok: true });
}
