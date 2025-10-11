"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const example_service_1 = __importDefault(require("../service/example.service"));
const getAllData = (req, res) => {
    const data = example_service_1.default.findAll();
    res.status(200).json({
        code: 200,
        message: "success",
        data: data,
    });
};
const ExampleController = {
    getAllData,
};
exports.default = ExampleController;
