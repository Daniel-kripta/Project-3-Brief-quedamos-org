import { useState } from "react";
import API_URL from "../api/config.js";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la petición");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { request, loading, error };
}
