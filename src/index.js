import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { initBaseDeDatos } from "./bd/init.js";

try {
  await initBaseDeDatos();
  
  // 👇 ESTO ES CRÍTICO: Railway inyecta el puerto automáticamente
  const PORT = process.env.PORT || 3001;
  const HOST = '0.0.0.0'; // 👈 OBLIGATORIO para Railway
  
  // 👇 Escuchar en 0.0.0.0 con el puerto de Railway
  app.listen(PORT, HOST, () => {
    console.log(`✅ Servidor Express iniciado correctamente`);
    console.log(`🚀 Host: ${HOST}`);
    console.log(`🚀 Puerto: ${PORT}`);
    console.log(`🌍 URL pública: https://pedidosback-production.up.railway.app`);
    console.log(`📡 Endpoints:`);
    console.log(`   - GET  /`);
    console.log(`   - GET  /api/v1/usuarios`);
    console.log(`   - GET  /api/v1/pedidos`);
  });
  
} catch (err) {
  console.error("❌ Error conectando a la Base de Datos:", err);
  process.exit(1);
}