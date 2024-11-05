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
const client_1 = __importDefault(require("../client"));
const RoleSeeder_1 = __importDefault(require("./RoleSeeder"));
const UserSeeder_1 = __importDefault(require("./UserSeeder"));
const permissionSeeder_1 = __importDefault(require("./permissionSeeder"));
const seeders = [
    new RoleSeeder_1.default(),
    new UserSeeder_1.default(),
    new permissionSeeder_1.default(),
];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const seeder of seeders) {
        try {
            yield seeder.seed();
        }
        catch (e) {
            console.log(e);
        }
    }
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(e);
    yield client_1.default.$disconnect();
}));
