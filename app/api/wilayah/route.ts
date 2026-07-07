import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // provinces | regencies | districts | villages
  const id = searchParams.get("id");

  let targetUrl = "";

  if (type === "provinces") {
    targetUrl = "https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json";
  } else if (type === "regencies" && id) {
    targetUrl = `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${id}.json`;
  } else if (type === "districts" && id) {
    targetUrl = `https://emsifa.github.io/api-wilayah-indonesia/api/districts/${id}.json`;
  } else if (type === "villages" && id) {
    targetUrl = `https://emsifa.github.io/api-wilayah-indonesia/api/villages/${id}.json`;
  } else {
    return NextResponse.json({ error: "Invalid type or missing parent ID" }, { status: 400 });
  }

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) {
      throw new Error(`External API responded with status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch administrative region data" },
      { status: 500 }
    );
  }
}
