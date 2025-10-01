"use client";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export async function getUser(): Promise<User | null> {
  try {
    const supa = await createClient();
    const { data, error } = await supa.auth.getUser();

    if (error || !data?.user) {
      console.error("getUser error:", error);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("Unexpected getUser error:", err);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    const supa = await createClient();
    const { error } = await supa.auth.signOut();

    if (error) {
      throw error;
    }

    const response = await fetch("/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  } catch (err) {
    console.error("logout error:", err);
    throw err;
  }
}
