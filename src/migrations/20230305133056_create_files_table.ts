import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE files (
            id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
            name text NOT NULL,
            key text NOT NULL,
            type text NOT NULL,
            url text NOT NULL,
            owner_id uuid NOT NULL,
            CONSTRAINT fk_user FOREIGN KEY(owner_id) REFERENCES users(id)
        )
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
        DROP TABLE files
    `);
}
