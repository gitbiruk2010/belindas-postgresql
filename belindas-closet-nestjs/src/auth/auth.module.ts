import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stragety';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            return {
              secret: config.get<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: config.get<string>('JWT_EXPIRES'),
              },
            };
          },
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
      exports: [JwtStrategy, PassportModule],
})
  export class AuthModule {}