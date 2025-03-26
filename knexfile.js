import "dotenv/config";

export default {
  client: "pg",
  connection: `postgresql://postgres:${process.env.SUPABASE_PASSWORD}@db.${process.env.SUPABASE_URL}.supabase.co:5432/postgres`,
  pool: {
    min: 2,
    max: 10,
  },
  /*{
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true,
  },*/
};
