"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const home_1 = __importDefault(require("./home"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const dashboard_1 = __importDefault(require("./dashboard"));
const oauth_1 = __importDefault(require("./oauth"));
const client_1 = __importDefault(require("../../prisma/client"));
const room_1 = __importDefault(require("./room"));
const requiredUser_1 = __importDefault(require("../middlewares/requiredUser"));
const router = (0, express_1.Router)();
router.get("/healthChecker", (req, res, next) => {
    res.sendStatus(200).end();
});
router.use(auth_1.default);
router.use("/user", authMiddleware_1.default, user_1.default);
router.use("/api/oauth", oauth_1.default);
// router.use("/dashboard", authMiddleWare, CheckRoleMiddleware.isAdmin, dashboardRouter)
router.use("/dashboard", dashboard_1.default);
router.use("/home", authMiddleware_1.default, home_1.default);
router.use("/room", authMiddleware_1.default, requiredUser_1.default, room_1.default);
router.get("/testing", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield client_1.default.room.findFirst({
        where: {
            id: "jfksdjfs"
        },
        include: {
            users: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                            verify: true,
                            role: true,
                            password: false
                        }
                    },
                    role: {
                        select: {
                            role_id: true,
                            role_name: true,
                        }
                    }
                }
            },
        }
    });
    console.log(room.users);
    res.send("test route").status(200).end();
}));
// console.log(path.resolve(__dirname, "build", "index.html"));
// not found route
router.use((req, res, next) => {
    res.send("page not found").status(404).end();
});
exports.default = router;
