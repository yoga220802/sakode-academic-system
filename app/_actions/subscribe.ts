"use server";

import fs from "fs/promises";
import path from "path";

export async function subscribeEmail(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Format email tidak valid." };
  }

  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "subscribers.json");

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    let subscribers: string[] = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      subscribers = JSON.parse(fileData);
    } catch (e) {
      // File doesn't exist yet, start with empty list
    }

    if (subscribers.includes(email)) {
      return { success: true, isDuplicate: true };
    }

    subscribers.push(email);
    await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), "utf-8");

    return { success: true, isDuplicate: false };
  } catch (error) {
    console.error("Failed to subscribe email server action error:", error);
    return { success: false, error: "Gagal menyimpan email ke database lokal. Silakan coba lagi." };
  }
}
