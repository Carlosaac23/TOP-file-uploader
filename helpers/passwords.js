import bcryp from 'bcrypt';

export async function generateHashedPassword(password, salt) {
  return await bcryp.hash(password, salt);
}

export async function validateHashedPassword(password, hashedPassword) {
  return await bcryp.compare(password, hashedPassword);
}
