import { Router } from "express";
import {
  getUser,
  getUserByHandle,
  searchByHandle,
  updateUser,
  uploadImage,
} from "../controllers/user";
import { authenticated } from "../middlewares/auth";
import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation";

const router = Router();

//GET Methods
router.get("/", authenticated, getUser);
router.get("/:handle", getUserByHandle);

//POST Methods
router.post("/image", authenticated, uploadImage);
router.post(
  "/handle/search",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  handleValidationErrors,
  searchByHandle
);

//PATCH Methods
router.patch("/", authenticated, updateUser);

export default router;
