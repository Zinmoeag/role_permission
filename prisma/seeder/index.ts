import prisma from "../client";
import RoleSeeder from "./RoleSeeder";
import UserSeeder from "./UserSeeder";
import PersmissionSeeder from "./permissionSeeder";
import SeederModel from "./model/SeederModel";

const seeders: SeederModel[] = [
  new RoleSeeder(),
  new UserSeeder(),
  new PersmissionSeeder(),
];

const main = async () => {
  for (const seeder of seeders) {
    try {
      await seeder.seed();
    } catch (e) {
      console.log(e);
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
