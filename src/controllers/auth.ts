import User from "../models/User";
import slugify from "slugify";
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

// Controlador para crear una cuenta
export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, handle, links } = req.body;

  // Formatear el handle
  const handleFormated = slugify(handle, {
    replacement: "_",
    lower: true,
  });

  try {
    // Verificar si el correo ya está registrado
    const userExist = await User.findOne({ email });
    if (userExist) {
      const error = new Error("El correo ya está registrado");
      res.status(409).json({ error: error.message });
      return; // Detiene la ejecución
    }

    // Verificar si el handle ya está registrado
    const handleExist = await User.findOne({ handle: handleFormated });
    if (handleExist) {
      const error = new Error("El handle ya está registrado");
      res.status(409).json({ error: error.message });
      return;
    }

    // Encriptar la contraseña y crear el nuevo usuario
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      links,
      password: hashedPassword,
      handle: handleFormated,
    });
    await newUser.save();

    // Enviar la respuesta con el nuevo usuario
    res.status(200).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Controlador para iniciar sesión
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Correo no registrado");
      res.status(404).json({ error: error.message });
      return;
    }

    // Verificar si la contraseña es correcta
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Contraseña incorrecta");
      res.status(401).json({ error: error.message });
      return;
    }

    const token = generateJWT({ id: user._id });

    res.status(200).json({ message: "Inicio de sesión exitoso", token: token });

    // Simulación de éxito
    // res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
