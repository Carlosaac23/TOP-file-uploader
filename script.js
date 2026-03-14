import { prisma } from './lib/prisma.js';

// await prisma.user.create({
//   data: {
//     name: 'Carlos',
//     email: 'carlos@gmail.com',
//     password: 'password',
//   },
// });

async function findUser(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

console.log(await findUser('carlos@gmail.com'));
