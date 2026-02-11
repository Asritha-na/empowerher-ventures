import React, { useEffect } from "react";
import { createPageUrl } from "@/utils";

// Public landing route "/" should use the existing Landing page design.
export default function Home() {
  useEffect(() => {
    // Immediately show the existing Landing page (no sidebar)
    window.location.href = createPageUrl("Landing");
  }, []);
  return null;
}