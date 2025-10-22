"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8ktCM2vUCsj/g\nHOdDJGLfRodgxmpxEuCtz0lixBtg50WehTyc9d1fGg/HqhJ/HSUEve/ZiwhRuE1w\n96Ui/YmV9J8ocyzGXllzdFgo/iKq1SdIyjNu68QAad4ezNjHAcwbAuCJSJngH0qX\ni+6FWTxIOjN4hfZxv2PB96B4KRTgpf7zCSGkfJGOnimpZqMWFRT2807OpKfBrVr7\nA3Q0uKBLp/Ffn6Rz4QxiUy9OM6z7yxabIb6vNnjYrMcnDmXZhlHNGWEcHGZWxkC0\nwZpBnBApyYCiXA9nMMlEkKbFqWeDeglC0I9k3DlYuiZujidhPz1OvkKZiRpaQypb\nqHQ+gMzFAgMBAAECggEAB89EFX6gmgbRerxyXsdRfvINUOvhZE3GAfzCiyAYYC2D\n0RpZ1chK7ZGHPht5iPZ8iNM9l91YWrC5fahhQu82ylU8sttTleLkwnwlheEXL3Wv\ncFDLdi22dYFCQoqfnweghoKFKQ+u1meFWnxgRE6F9BnQ9Y4Faarlp0FUTdWpuISl\nHpJRHExu/nJ4nhu8NuFlwQBy8IprGQSsCeO48wHu0YHqRKYyVmdeH0RAEnr0Z21Z\ngluOIL8P5/b08Leo5QTE6LRAYGatFKEZe+8gu+fOusW0fACBuygdEz24JEVdU503\nIFm3QM9mkGFTr3LppngxFl3w5kMTbZsX3l16aaVRiwKBgQDyVEUG8GFJ2C4IWxfq\nB9TtHIkCkPQT7JEwGSreO6AHX2MHgxuN5uqX4RpdtN/OhVKnX2H1p3yZJ7HoxCSF\n27v2PCp6elPqaRLAUS/uhWjvVQLlPtTPiwW4GoiODmqPvY8E9ou5Psdgv+8lLDwG\n+AWsZBxsR/2M4IX9h8EPL7NHpwKBgQDHNjPjP43uCpckGLdbKjzDYWpBlXO+aH2s\nWKIRgqw9fEIKze5fRw1jW3l9gbayHLN8Gq8XjfTzatmtUtabf48pvH5uuKKRuBQ7\nS+JYfqLmfJvLADXUUeTnEGVf0XdAsLk5gP4uXeuHtO0kfjRoDuGbfZR3PZlKKUAo\nDYQw7zMVswKBgHDhUEYrMyZyzP6XcExT2ZuZ7ziCzS96wybkklNy8th8VmTpbaxs\nJFsbQGzmFFrfP+E3TSphGmk9VGJY+6pe8O+Cl0b2NKC80T9Ekk9JVdgmgXLIEdmb\nqM5ZjcKedIUAh96H+g4QcE9hGMT4Ff4pCnuDJrpJzpIRBFlVI1kvnxOBAoGAIrHn\n+44YE/s4M4syc+g5SPXwYZe73s+oA5o0L8SIZvT7M5KGD4X6aPGHiTpMLV0eTWEA\nWaPZo4NagftJcS+YKXawtmvltGdQ7rraovr7OBU/tO1GcsIIkc2jOjrrABNHTyKO\nIlktKidyncZ1LiJZXJFUiCfsSKRCjjc8bKFcTk0CgYB8av6W3OLLAPqs/vf1f0SG\nTv1BOczw/Ru7fTiF9M1HdK6+7iEsDM9/Q8TQ0D2ps4+eCPc6FM8awzPRk2V5pcyo\nV9dPEb9n4ycL6CXqq6Ker8/tbFIFgZbuVoMVOfGdLLDZztAaLrG5FT5QXyDgIdFE\ntHiK8C/PSNCTRJImoqXs5Q==\n-----END PRIVATE KEY-----\n";
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey?.replace(/\\n/g, "\n"),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}
console.log({
    length: process.env.FIREBASE_PRIVATE_KEY?.length,
    firstChars: process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30),
    lastChars: process.env.FIREBASE_PRIVATE_KEY?.slice(-30),
});
console.log(process.env.FIREBASE_PRIVATE_KEY);
exports.bucket = firebase_admin_1.default
    .storage()
    .bucket(process.env.FIREBASE_STORAGE_BUCKET);
