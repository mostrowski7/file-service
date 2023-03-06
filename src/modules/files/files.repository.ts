import { Injectable } from '@nestjs/common';
import DatabaseService from '../database/database.service';
import { User } from '../users/entities/user.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createWithAssignedOwner(
    { name, key, type, url }: CreateFileDto,
    { id: userId, username, email }: User,
  ): Promise<void> {
    const client = await this.databaseService.getClientPool();

    try {
      await client.query(`BEGIN;`);

      await client.query(
        `
          INSERT INTO users (id, username, email) VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING;
        `,
        [userId, username, email],
      );

      await client.query(
        `
          INSERT INTO files (name, key, type2, url, owner_id)
          VALUES ($1, $2, $3, $4, $5);
      `,
        [name, key, type, url, userId],
      );

      client.query(`
        COMMIT;
      `);
    } catch (error) {
      client.query(`
        ROLLBACK;
      `);

      throw error;
    } finally {
      client.release();
    }
  }
}
