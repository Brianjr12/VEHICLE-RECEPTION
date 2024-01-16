import express from "express";
import { getModelsH } from "../handlers/GET/getModelsH.js";

export const router = express();

router.get("/models", getModelsH);
