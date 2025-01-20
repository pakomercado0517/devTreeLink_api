import { CorsOptions } from "cors";
const { FRONTEND_URL } = process.env;

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const whiteList = [FRONTEND_URL, "http://localhost:5173"];
    if (process.argv[2] === "--api") {
      whiteList.push(undefined); // Permite solicitudes sin 'Origin'
    }

    // Permite solicitudes sin origen (Postman)
    if (!origin || whiteList.includes(origin)) {
      callback(null, true); // Solicitud permitida
    } else {
      callback(new Error("No está permitido por los CORS")); // Solicitud bloqueada
    }
  },
};
