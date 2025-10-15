"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
exports.generateUniqueEmail = generateUniqueEmail;
const uuid_1 = require("uuid");
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
function generateUniqueEmail(domain = "gmail.com") {
    const uniqueId = (0, uuid_1.v4)();
    return `user.${uniqueId}@${domain}`;
}
// Example usage
// console.log(generateUniqueEmail()); // user.550e8400-e29b-41d4-a716-446655440000@example.com
// console.log(generateUniqueEmail("test.com")); // user.550e8400-e29b-41d4-a716-446655440001@test.com
