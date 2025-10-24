import express from "express";
import { sendToGemini } from "../controllers/gemini.controller.js";

const router = express.Router();

// Debug/health endpoint: helps browser checks or simple GETs from the client
router.get("/", (req, res) => {
	return res.json({ ok: true, message: "Gemini route active" });
});

router.post("/chat", sendToGemini);

export default router;