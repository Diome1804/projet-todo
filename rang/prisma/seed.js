import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("\n🌱 Seeding database...\n");

  // Danger: cleanup existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const password = "password123";
  const hash = await bcrypt.hash(password, 10);

  const alice = await prisma.user.create({
    data: { email: "alice@example.com", password: hash, name: "Alice Johnson" }
  });
  const bob = await prisma.user.create({
    data: { email: "bob@example.com", password: hash, name: "Bob Smith" }
  });

  await prisma.task.createMany({
    data: [
      { lex_name: "Préparer le rapport", lex_description: "Compiler les chiffres du T3", completed: false, userId: alice.id },
      { lex_name: "Acheter des fournitures", lex_description: "Papier, stylos, dossiers", completed: true, userId: alice.id },
      { lex_name: "Planifier la réunion", lex_description: "Inviter l’équipe et réserver la salle", completed: false, userId: bob.id }
    ]
  });

  const users = await prisma.user.findMany({ include: { tasks: true } });
  console.dir(users, { depth: null });
  console.log("\nSeeding terminé !\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
