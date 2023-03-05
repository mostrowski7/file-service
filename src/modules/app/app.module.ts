import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment, validate } from '../../config/env.validation';
import { AuthModule } from '../auth/auth.module';
import DatabaseModule from '../database/database.module';
import { FilesModule } from '../files/files.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate,
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host:
          configService.get('NODE_ENV') === Environment.Test
            ? configService.get('POSTGRES_TEST_HOST')
            : configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        user: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
      }),
    }),
    HealthModule,
    AuthModule,
    FilesModule,
  ],
})
export class AppModule {}
