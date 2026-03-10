import mongoose, { Schema } from "mongoose";

/**
 * @typedef {Object} Pedido
 * @property {ObjectId} cliente - Referencia al usuario que hizo el pedido
 * @property {Date} fecha_solicitud - Fecha de solicitud del pedido
 * @property {Date} fecha_envio - Fecha de envío del pedido
 * @property {number} total - Total del pedido (por defecto 0.0)
 * @property {string[]} pagado - Lista de métodos de pago utilizados
 * @property {number} abono - Monto abonado al pedido
 * @property {string} comentario - Comentarios adicionales sobre el pedido
 */
const pedidoSchema = new Schema(
  {
    // 👇 ESTA ES LA LÍNEA QUE DEBES CAMBIAR/AÑADIR
    cliente: { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
    // 👇 ESTOS CAMPOS YA NO SON NECESARIOS (los obtienes del usuario)
    // nombre: { type: String, required: true },
    // telefono: { type: String, required: true, length: 10 },
    
    fecha_solicitud: { type: Date, required: true },
    fecha_envio: { type: Date, required: true },
    total: { type: Number, default: 0.0 },
    pagado: [String],
    abono: { type: Number },
    comentario: { type: String },
  },
  { timestamps: true },
);

export const Pedido = mongoose.model("pedido", pedidoSchema);