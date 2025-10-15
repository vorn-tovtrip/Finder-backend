import { v4 as uuidv4 } from "uuid";
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function generateUniqueEmail(domain = "gmail.com") {
  const uniqueId = uuidv4();
  return `user.${uniqueId}@${domain}`;
}

// Example usage
// console.log(generateUniqueEmail()); // user.550e8400-e29b-41d4-a716-446655440000@example.com
// console.log(generateUniqueEmail("test.com")); // user.550e8400-e29b-41d4-a716-446655440001@test.com
