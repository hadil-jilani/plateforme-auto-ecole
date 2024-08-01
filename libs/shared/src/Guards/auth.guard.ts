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
    const req = context.switchToHttp().getRequest<Request>(); // Extracting request object from ExecutionContext

    // Extract access token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    const [type, accessToken] = authHeader.split(' ');
    if (type !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid authorization header format!');
    }

    try {
      const decoded = this.jwtService.verify(accessToken, { secret: this.config.get<string>('ACCESS_TOKEN_SECRET') });
      console.log(decoded)
      return true;
    } catch (err) {
      await this.updateAccessToken(req);
      return true;
    }
  }

  private async updateAccessToken(req: any): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Please login again to access this resource!');
      }

      const [type, refreshToken] = authHeader.split(' ');
      if (type !== 'Bearer' || !refreshToken) {
        throw new UnauthorizedException('Invalid authorization header format!');
      }

      const decoded = this.jwtService.verify(refreshToken, { secret: this.config.get<string>('REFRESH_TOKEN_SECRET') });

      const user = await this.SchoolModel.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedException('User not found, please register first!');
      }

      const accessToken = this.jwtService.sign(
        { id: user.id, role: user.role },
        { secret: this.config.get<string>('ACCESS_TOKEN_SECRET'), expiresIn: '30m' },
      );

      req.headers.authorization = `Bearer ${accessToken}`;
      req.user = this.jwtService.decode(accessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token!');
    }
  }
}
