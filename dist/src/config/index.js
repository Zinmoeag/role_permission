"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = __importDefault(require("./application"));
class AppConfig {
    constructor() { }
    static getInstance() {
        if (!this._instance) {
            this._instance = new AppConfig();
        }
        return this._instance;
    }
    static register(configs) {
        this.getInstance();
        Object.entries(configs).map(([key, value]) => {
            if (!value) {
                throw new Error(`value of ${key} cannot be null`);
            }
            this.configs[key] = value;
        });
        return this;
    }
    static getConfig(key) {
        if (key === undefined || !(key in this.configs)) {
            throw new Error(`Invalid config key: ${key}`);
        }
        return this.configs[key];
    }
}
AppConfig.configs = {
//... application configurations
};
//register configuration
AppConfig.register(Object.assign({}, application_1.default));
exports.default = AppConfig;
