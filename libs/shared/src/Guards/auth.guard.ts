import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express'; // Import Request type from express
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SchoolModel } from '../Schemas/school.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(SchoolModel.name) private SchoolModel: mongoose.Model<SchoolModel>,
              private readonly jwtService: JwtService,
              private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>(); // Extract request object
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    const [type, accessToken] = authHeader.split(' ');
    if (type !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid authorization header format!');
    }

    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });
      req['user'] = decoded; // Add user information to the request
      return true;
    } catch (err) {
      // Access token is invalid or expired, try refreshing the token
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!refreshToken) {
        throw new UnauthorizedException('Access token expired and no refresh token provided!');
      }

      const newAccessToken = await this.refreshAccessToken(refreshToken);
      req.headers.authorization = `Bearer ${newAccessToken}`;
      req['user'] = this.jwtService.decode(newAccessToken);
      return true;
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });
      const user = await this.SchoolModel.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token!');
      }

      const newAccessToken = this.jwtService.sign(
        {
          id: user._id,
          role: user.role,
          fullName: user.name
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '20m',
        },
      );

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }
}
