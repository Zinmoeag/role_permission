import { Router } from "express";
import roomController from "../controllers/roomController";
import requiredUser from "../middlewares/requiredUser";
import { LoginCredentialSchema } from "../schema/authSchema";
import validate from "../middlewares/vaildate";

const roomRouters = Router();

roomRouters.get("/", roomController.getRooms);
roomRouters.post("/create", validate(LoginCredentialSchema), roomController.create);


export default roomRouters