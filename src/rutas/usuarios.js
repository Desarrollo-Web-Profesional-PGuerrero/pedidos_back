import {
  createUsuario,
  loginUsuario,
  getUsuarioInfoById,
  getAllUsuarios, // ← Importa la nueva función
} from "../servicios/usuarios.js";

export function usuarioRoutes(app) {
  app.post("/api/v1/usuario/signup", async (req, res) => {
    try {
      const usuario = await createUsuario(req.body);
      return res.status(201).json({ username: usuario.username });
    } catch (err) {
      return res.status(400).json({
        error: "Falló al crear el usuario, ¿El usuario ya existe?",
      });
    }
  });

  app.post("/api/v1/usuario/login", async (req, res) => {
    try {
      const token = await loginUsuario(req.body);
      return res.status(200).send({ token });
    } catch (err) {
      return res.status(400).send({
        error: "Login Falló, ¿Ingresaste el Usuario/Contraseña correcta?",
      });
    }
  });

  app.get("/api/v1/usuarios/:id", async (req, res) => {
    const userInfo = await getUsuarioInfoById(req.params.id);
    return res.status(200).send(userInfo);
  });

  // ✅ NUEVO ENDPOINT: Obtener todos los usuarios
  app.get("/api/v1/usuarios", async (req, res) => {
    try {
      const usuarios = await getAllUsuarios();
      return res.status(200).json(usuarios);
    } catch (err) {
      return res.status(500).json({ 
        error: "Error al obtener los usuarios",
        message: err.message 
      });
    }
  });
}