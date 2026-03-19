// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { initBaseDeDatos } from "./bd/init.js";

/**
 * Iniciar el servidor Express después de conectar a la base de datos
 */
try {
  await initBaseDeDatos();
  
  // Usar el puerto de Railway o 3001 como fallback
  const PORT = process.env.PORT || 3001;
  
  // 👇 IMPORTANTE: Escuchar en 0.0.0.0 (todas las interfaces)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor Express iniciado correctamente`);
    console.log(`🚀 Puerto: ${PORT}`);
    console.log(`🌍 URL pública: https://pedidosback-production.up.railway.app`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`   - GET  /`);
    console.log(`   - GET  /api/v1/usuarios`);
    console.log(`   - POST /api/v1/usuario/signup`);
    console.log(`   - POST /api/v1/usuario/login`);
    console.log(`   - GET  /api/v1/pedidos`);
    console.log(`   - POST /api/v1/pedidos`);
  });
  
} catch (err) {
  console.error("❌ Error conectando a la Base de Datos:", err);
  process.exit(1); // Importante: salir si hay error
}