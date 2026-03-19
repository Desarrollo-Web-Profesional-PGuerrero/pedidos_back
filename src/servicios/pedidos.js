// servicios/pedidos.js
import { Pedido } from "../bd/modelos/pedido.js";
import { Usuario } from "../bd/modelos/usuario.js";

export async function creaPedido({
  cliente,
  fecha_solicitud,
  fecha_envio,
  total,
  pagado,
  abono,
  comentario,
}) {
  console.log("\n🔍 CREANDO PEDIDO");
  console.log("   Cliente ID recibido:", cliente);
  
  const usuarioExistente = await Usuario.findById(cliente);
  console.log("   Usuario encontrado:", usuarioExistente ? usuarioExistente.username : "NO EXISTE");
  
  if (!usuarioExistente) {
    throw new Error("El cliente especificado no existe");
  }

  const pedido = new Pedido({
    cliente: cliente,
    fecha_solicitud,
    fecha_envio,
    total: total || 0.0,
    pagado: pagado || [],
    abono: abono || 0,
    comentario: comentario || "",
  });
  
  const pedidoGuardado = await pedido.save();
  console.log("✅ Pedido guardado con ID:", pedidoGuardado._id.toString().slice(-6));
  
  return pedidoGuardado;
}

export async function listaPedidos(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  console.log("\n🔍 LISTANDO PEDIDOS");
  console.log("   Query:", JSON.stringify(query));
  
  // Ver qué hay en la base de datos SIN populate
  const pedidosRaw = await Pedido.find(query).lean();
  console.log("📦 Pedidos en BD (IDs de cliente):");
  pedidosRaw.forEach((p, i) => {
    console.log(`   ${i+1}. Pedido: ${p._id.toString().slice(-6)}, cliente ID: ${p.cliente ? p.cliente.toString().slice(-6) : 'null'}`);
  });

  // Ver los usuarios disponibles
  const usuarios = await Usuario.find().lean();
  console.log("👤 Usuarios disponibles:");
  usuarios.forEach((u, i) => {
    console.log(`   ${i+1}. ID: ${u._id.toString().slice(-6)}, username: ${u.username}`);
  });

  // Hacer la consulta CON populate
  const pedidos = await Pedido.find(query)
    .populate({
      path: 'cliente',
      model: 'usuario',
      select: 'username _id'
    })
    .sort({ [sortBy]: sortOrder })
    .lean();

  console.log("📦 Resultado final (con populate):");
  pedidos.forEach((p, i) => {
    if (p.cliente && typeof p.cliente === 'object' && p.cliente.username) {
      console.log(`   ${i+1}. Pedido: ${p._id.toString().slice(-6)} -> Cliente: ${p.cliente.username}`);
    } else if (p.cliente && typeof p.cliente === 'object') {
      console.log(`   ${i+1}. Pedido: ${p._id.toString().slice(-6)} -> Cliente: [Objeto sin username]`);
    } else {
      console.log(`   ${i+1}. Pedido: ${p._id.toString().slice(-6)} -> Cliente: ${p.cliente} (NO POPULATE)`);
    }
  });

  return pedidos;
}

export async function listaAllPedidos(opciones) {
  return await listaPedidos({}, opciones);
}

export async function listaPedidosByNombre(nombre, opciones) {
  console.log(`\n🔍 BUSCANDO PEDIDOS POR NOMBRE: ${nombre}`);
  // Esta función necesita buscar por username del cliente
  // Primero encontramos el usuario por username
  const usuario = await Usuario.findOne({ username: nombre });
  if (!usuario) {
    console.log("   ❌ Usuario no encontrado");
    return [];
  }
  console.log("   ✅ Usuario encontrado, ID:", usuario._id.toString().slice(-6));
  return await listaPedidos({ cliente: usuario._id }, opciones);
}

export async function listPedidosByPagado(pagado, opciones) {
  console.log(`\n🔍 BUSCANDO PEDIDOS POR MÉTODO DE PAGO: ${pagado}`);
  return await listaPedidos({ pagado: { $in: [pagado] } }, opciones);
}

export async function getPedidoById(pedidoId) {
  console.log("\n🔍 BUSCANDO PEDIDO POR ID:", pedidoId.slice(-6));
  
  const pedido = await Pedido.findById(pedidoId)
    .populate({
      path: 'cliente',
      model: 'usuario',
      select: 'username _id'
    })
    .lean();

  if (pedido) {
    console.log("✅ Pedido encontrado:");
    if (pedido.cliente && typeof pedido.cliente === 'object') {
      console.log(`   Cliente: ${pedido.cliente.username || 'sin username'}`);
    } else {
      console.log(`   Cliente: ${pedido.cliente} (solo ID)`);
    }
  } else {
    console.log("❌ Pedido no encontrado");
  }

  return pedido;
}

export async function modificaPedido(pedidoId, datosActualizados) {
  console.log("\n🔍 MODIFICANDO PEDIDO:", pedidoId.slice(-6));
  
  const pedido = await Pedido.findOneAndUpdate(
    { _id: pedidoId },
    { $set: datosActualizados },
    { new: true }
  ).populate({
    path: 'cliente',
    model: 'usuario',
    select: 'username _id'
  });

  console.log("✅ Pedido modificado");
  return pedido;
}

export async function eliminaPedido(pedidoId) {
  console.log("\n🔍 ELIMINANDO PEDIDO:", pedidoId.slice(-6));
  
  const result = await Pedido.deleteOne({ _id: pedidoId });
  if (result.deletedCount > 0) {
    console.log("✅ Pedido eliminado");
  } else {
    console.log("❌ Pedido no encontrado");
  }
  
  return result;
}