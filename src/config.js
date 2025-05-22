// src/config.js

const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
    ? "http://localhost:5000"
    : "/api/clave-sae";
