import { Request, Response } from "express";
import User from "../models/User";
import slugify from "slugify";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "token no válido " });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;
    const handle = slugify(req.body.handle, "_");

    //Verificamos el handle esté disponible
    const searchHandle = await User.findOne({ handle });
    if (searchHandle && searchHandle.email !== req.user.email) {
      const error = new Error("El handle no esta disponible");
      res.status(400).json({ error: error.message });
      return;
    }

    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;
    await req.user?.save();
    res.status(201).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });
  try {
    form.parse(req, (error, fields, files) => {
      if (files.file && files.file[0]) {
        cloudinary.uploader.upload(
          files.file[0].filepath,
          {},
          async (error, result) => {
            if (error) {
              const error = new Error("Hubo un error al subir la imagen");
              res.status(400).json({ error: error.message });
            }
            if (result) {
              req.user.image = result.secure_url;
              await req.user.save();
              res.status(200).json({
                message: "Imagen cargada con éxito",
                image: result.secure_url,
              });
            }
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserByHandle = async (req: Request, res: Response) => {
  const { handle } = req.params;
  try {
    const user = await User.findOne({ handle }).select(
      "-_id -__v -email -password"
    );
    if (!user) {
      const error = new Error("El usuario no existe.");
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

export const searchByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body;
    const isHandle = await User.findOne({ handle });
    if (isHandle) {
      const error = new Error(
        `${handle} no se encuentra disponible para su uso`
      );
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(200).send(`${handle} esta disponible para que lo uses`);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
