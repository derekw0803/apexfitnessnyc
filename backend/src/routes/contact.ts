import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { getAllContacts, getContactByLastName, addContact, editContact, deleteContact } from "../db/contact.js";
import { ApiResponse } from "../types/index.js";

const router = Router();

router.get("/all", asyncHandler(async (_req: Request, res: Response) => {
    const response: ApiResponse = {
        success: true,
        data: await getAllContacts(),
    };
    res.json(response);
}));

router.get("/:name", asyncHandler(async (req: Request, res: Response) => {
    const contacts = await getContactByLastName(req.params.name as string);
    const response: ApiResponse = {
        success: true,
        data: contacts,
    };
    res.json(response);
}));

router.post("/", asyncHandler(async (req: Request, res: Response) => {
    const contact = await addContact(req.body);
    res.status(201).json({ success: true, data: contact } satisfies ApiResponse);
}));

router.put("/:name", asyncHandler(async (req: Request, res: Response) => {
    const contact = await editContact(req.params.name as string, req.body);
    const response: ApiResponse = {
        success: true,
        data: contact,
    };
    res.json(response);
}));

router.delete("/:name", asyncHandler(async (req: Request, res: Response) => {
    await deleteContact(req.params.name as string);
    res.json({ success: true } satisfies ApiResponse);
}));

export default router;
