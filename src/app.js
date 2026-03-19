// backend/src/app.js
import express from "express";
import cors from "cors";
import { pedidosRoutes } from "./rutas/pedidos.js";
import { usuarioRoutes } from './rutas/usuarios.js'

// Crear la aplicación Express
const app = express();

// Configurar middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // express.json() es más moderno que bodyParser.json()

// Ruta de prueba (opcional)
app.get("/", (req, res) => {
  res.json({ 
    message: "API de Pedidos",
    version: "1.0.0",
    endpoints: {
      usuarios: "/api/v1/usuarios",
      pedidos: "/api/v1/pedidos"
    }
  });
});

// Configurar rutas
usuarioRoutes(app);
pedidosRoutes(app);

export { app };