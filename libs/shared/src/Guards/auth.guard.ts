
// AuthGuard wish verify the validity of the tokens if the access token is expired  it refresh it if we found that the refreshtoken is valid  

/*

El front lezem yabath el (refreshtoken) wl (accesstoken) bl asemi hethouma fi kol request yaamlou 
*/
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express'; // Import Request type from express
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EcoleModel } from '../Schemas/ecole.schema';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(EcoleModel.name) private EcoleModel : mongoose.Model<EcoleModel>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>(); // Extracting request object from ExecutionContext

    // accesstoken / refreshtoken hia el esm eli bch tabath big el request 
    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    if (accessToken) {
      const decoded = this.jwtService.decode(accessToken);
      const expirationTime = decoded?.exp;

      if (expirationTime * 1000 < Date.now()) {
 
       await this.updateAccessToken(req);
      }
    }
    return true;
  }

 private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers.refreshtoken as string;
      const decoded = this.jwtService.decode(refreshTokenData);
      const expirationTime = decoded.exp * 1000;
      if (expirationTime < Date.now()) {
        throw new UnauthorizedException('Please login again to access this resource!');
      }

      // Fetch user from MongoDB using Mongoose
      const user = await this.EcoleModel.findById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found please register first !');
      }

      // Generate new tokens
      const accessToken = this.jwtService.sign(
        { id: user.id,
          role : user.role
         },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '10m',
        },
      );

      const refreshToken = this.jwtService.sign(
        { id: user.id,
          role : user.role
         },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '1d',
        },
      );

      // Update request object with tokens and user
      req.headers.accesstoken = accessToken;
      req.headers.refreshtoken = refreshToken;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
