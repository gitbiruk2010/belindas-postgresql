import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubmissionFormModule } from './submission-form/submission-form.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { SubmissionForm } from './submission-form/entities/submission-form.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Product, SubmissionForm],
        synchronize: process.env.NODE_ENV === 'development', // Only for development
        logging: process.env.NODE_ENV === 'development',
        autoLoadEntities: true,
      }),
    }),
    ProductsModule,
    AuthModule,
    UserModule,
    SubmissionFormModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES') || '4h',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
