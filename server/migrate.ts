import { config } from "dotenv"
import {drizzle} from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

const migrationClient = postgres(process.env.DATABASE_URL!,{max:1})

await migrate(drizzle(migrationClient),{migrationsFolder:"./drizzle"})
console.log("---------Migration Completed--------");
