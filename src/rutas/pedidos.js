// rutas/pedidos.js
import {
  creaPedido,
  listaPedidos,
  listaAllPedidos,
  listaPedidosByNombre,
  listPedidosByPagado,
  getPedidoById,
  modificaPedido,
  eliminaPedido,
} from "../servicios/pedidos.js";

export function pedidosRoutes(app) {
  console.log("✅ Rutas de pedidos cargadas");

  // Listar Pedidos con filtros opcionales
  app.get("/api/v1/pedidos", async (req, res) => {
    const { sortBy, sortOrder, nombre, pagado } = req.query;
    const opciones = { sortBy, sortOrder };
    
    console.log("\n📍 GET /api/v1/pedidos");
    console.log("   Query params:", { nombre, pagado });
    
    try {
      let pedidos;
      
      if (nombre && pagado) {
        return res.status(400).json({ error: "Consulta por nombre o status, No Ambos" });
      } else if (nombre) {
        console.log("   Filtrando por nombre:", nombre);
        pedidos = await listaPedidosByNombre(nombre, opciones);
      } else if (pagado) {
        console.log("   Filtrando por pagado:", pagado);
        pedidos = await listPedidosByPagado(pagado, opciones);
      } else {
        console.log("   Obteniendo todos los pedidos");
        pedidos = await listaAllPedidos(opciones);
      }
      
      console.log(`   ✅ Enviando ${pedidos.length} pedidos al frontend`);
      return res.json(pedidos);
    } catch (err) {
      console.error("❌ Error listando Pedidos", err);
      return res.status(500).end();
    }
  });

  // Obtener un Pedido por ID
  app.get("/api/v1/pedidos/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`\n📍 GET /api/v1/pedidos/${id.slice(-6)}`);
    
    try {
      const pedido = await getPedidoById(id);
      if (pedido === null) {
        console.log("   ❌ Pedido no encontrado");
        return res.status(404).end();
      }
      console.log("   ✅ Pedido encontrado");
      return res.json(pedido);
    } catch (err) {
      console.error("❌ Error obteniendo Pedido", err);
      return res.status(500).end();
    }
  });

  // Crear un nuevo Pedido
  app.post("/api/v1/pedidos", async (req, res) => {
    console.log("\n📍 POST /api/v1/pedidos");
    console.log("   Datos recibidos:", req.body);
    
    try {
      const pedido = await creaPedido(req.body);
      console.log("   ✅ Pedido creado con ID:", pedido._id.toString().slice(-6));
      return res.status(201).json(pedido);
    } catch (err) {
      console.error("❌ Error creando pedido", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Modificar un Pedido existente
  app.patch("/api/v1/pedidos/:id", async (req, res) => {
    console.log(`\n📍 PATCH /api/v1/pedidos/${req.params.id.slice(-6)}`);
    
    try {
      const pedido = await modificaPedido(req.params.id, req.body);
      console.log("   ✅ Pedido modificado");
      return res.json(pedido);
    } catch (err) {
      console.error("❌ Error modificando Pedido", err);
      return res.status(500).end();
    }
  });

  // Eliminar un Pedido por ID
  app.delete("/api/v1/pedidos/:id", async (req, res) => {
    console.log(`\n📍 DELETE /api/v1/pedidos/${req.params.id.slice(-6)}`);
    
    try {
      const { deletedCount } = await eliminaPedido(req.params.id);
      if (deletedCount === 0) {
        console.log("   ❌ Pedido no encontrado");
        return res.sendStatus(404);
      }
      console.log("   ✅ Pedido eliminado");
      return res.status(204).end();
    } catch (err) {
      console.error("❌ Error eliminando Pedido", err);
      return res.status(500).end();
    }
  });
}