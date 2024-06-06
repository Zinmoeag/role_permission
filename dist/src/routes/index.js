"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use("/", (req, res, next) => {
    res.send(200);
});
exports.default = router;
// console.log(router)
