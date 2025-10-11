"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_1 = require("../utils/mock");
class ExampleService {
    constructor() { }
    findAll() {
        return mock_1.DUMMY_DATA;
    }
}
exports.default = new ExampleService();
