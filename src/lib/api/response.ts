import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(status: number, error: unknown) {
  return NextResponse.json(
    { error: typeof error === "string" ? error : "Request failed" },
    { status }
  );
}