import { Router } from "express";
import {
    getAllContacts,
    getContactsForList,
    searchContacts,
    sendRequest,
} from "../controllers/ContacsControllers.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/all-contacts", verifyToken, getAllContacts);
contactsRoutes.get("/get-contacts-for-list", verifyToken, getContactsForList);
contactsRoutes.post("/send-request", sendRequest);


export default contactsRoutes;