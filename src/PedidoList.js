import { useState, useEffect } from "react";
import API from "../servicios/api";

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await API.get("/pedidos");
      console.log("Pedidos con clientes:", response.data);
      setPedidos(response.data);
      setError(null);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await API.delete(`/pedidos/${id}`);
        setPedidos(pedidos.filter(pedido => pedido._id !== id));
        alert("✅ Pedido eliminado correctamente");
      } catch (error) {
        console.error("Error eliminando pedido:", error);
        alert("❌ Error al eliminar el pedido");
      }
    }
  };

  // Filtrar pedidos por nombre de cliente
  const pedidosFiltrados = pedidos.filter(pedido => 
    pedido.cliente?.username?.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido._id.includes(filtro)
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 p-4">
      <p>{error}</p>
      <button 
        onClick={cargarPedidos}
        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            📋 Lista de Pedidos
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={cargarPedidos}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Actualizar
            </button>
          </div>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No hay pedidos para mostrar</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {pedido.cliente?.username || "Cliente no disponible"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        ID: {pedido._id.slice(-6)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">📅 Solicitud</p>
                        <p className="font-medium">
                          {new Date(pedido.fecha_solicitud).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">📦 Envío</p>
                        <p className="font-medium">
                          {new Date(pedido.fecha_envio).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">💰 Total</p>
                        <p className="font-medium text-green-600">
                          ${pedido.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">💵 Abono</p>
                        <p className="font-medium text-blue-600">
                          ${(pedido.abono || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pedido.pagado?.map((metodo, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                        >
                          {metodo}
                        </span>
                      ))}
                    </div>

                    {pedido.comentario && (
                      <p className="text-gray-600 text-sm border-t pt-2">
                        <span className="font-medium">📝 Comentario:</span> {pedido.comentario}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Aquí iría la función para editar */}}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleEliminar(pedido._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400 flex gap-4">
                  <span>Creado: {new Date(pedido.createdAt).toLocaleString()}</span>
                  <span>Actualizado: {new Date(pedido.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PedidoList;