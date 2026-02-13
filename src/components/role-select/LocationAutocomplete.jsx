import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

// IMPORTANT: Replace this with your actual Google Maps API key (restricted to your domain)
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // TODO: replace

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }
    if (!apiKey || apiKey === "AIzaSyDr9ePqMukxX6VoRqnRXQTFI-fNnDW1wxc") {
      reject(new Error("Missing Google Maps API key"));
      return;
    }
    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function LocationAutocomplete() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let autocomplete;

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then(() => {
        setReady(true);
        if (!inputRef.current) return;
        // Initialize Places Autocomplete
        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["address_components", "geometry", "formatted_address"],
          types: ["geocode"],
        });
        autocomplete.addListener("place_changed", async () => {
          const place = autocomplete.getPlace();
          if (!place || !place.geometry) {
            setStatus("Could not get location details. Try again.");
            return;
          }

          const getComp = (type) => {
            const comp = (place.address_components || []).find((c) => c.types.includes(type));
            return comp ? comp.long_name : "";
          };

          const city = getComp("locality") || getComp("sublocality") || getComp("administrative_area_level_2");
          const state = getComp("administrative_area_level_1");
          const pincode = getComp("postal_code");
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const formatted = place.formatted_address || "";

          setStatus("Saving...");
          await base44.auth.updateMe({
            location_formatted: formatted,
            location_latitude: lat,
            location_longitude: lng,
            location_city: city,
            location_state: state,
            location_pincode: pincode,
          });
          setStatus("Location saved");
          setTimeout(() => setStatus(""), 2500);
        });
      })
      .catch(() => {
        setStatus("Add your Google Maps API key to enable autocomplete");
      });

    return () => {
      // No explicit cleanup API for Autocomplete instance needed
      autocomplete = null;
    };
  }, []);

  return (
    <div>
      <label className="block text-sm text-pink-100 mb-2">Set your location</label>
      <Input
        ref={inputRef}
        placeholder={ready ? "Start typing your address..." : "Loading Google Autocomplete..."}
        disabled={!ready}
        className="bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-500"
      />
      {status && <p className="mt-2 text-xs text-pink-200">{status}</p>}
    </div>
  );
}