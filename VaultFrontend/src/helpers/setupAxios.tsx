// src/api/setupAxios.ts
import axios from "axios";

// Set default baseURL depending on environment
axios.defaults.baseURL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "http://165.22.215.73:81/"
    : "http://localhost:5000/";
