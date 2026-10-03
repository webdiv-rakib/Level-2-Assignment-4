import { Router } from "express";
import { authContoller } from "./auth.controller";

const router = Router();

router.post('/login', authContoller.loginUser);


export const authRoutes = router;