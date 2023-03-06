import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
        CREATE TABLE users (
            id uuid NOT NULL PRIMARY KEY,
            username text NOT NULL,
            email text NOT NULL
        )    
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
        DROP TABLE users
    `);
}
