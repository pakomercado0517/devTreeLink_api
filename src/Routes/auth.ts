import { Router } from "express";
import {body} from "express-validator";
import { createAccount, login } from "../controllers/auth";
import { handleValidationErrors } from "../middlewares/validation";

const router = Router();

//Autenticación y Registro de usuarios
router.post("/register",
  body("handle").notEmpty().withMessage("El handle es requerido"),
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("El correo es inválido"),
  body("password").isLength({min:8}).withMessage("La contraseña es muy corta"),
  handleValidationErrors,
  createAccount)

router.post("/login",
  body("email").isEmail().withMessage("El correo es inválido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleValidationErrors,
  login
  )

export default router;