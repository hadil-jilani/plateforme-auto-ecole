import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../Schemas/role.enum';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor (private reflecotr : Reflector,private readonly jwtService: JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean  {
  

  const RequiredRoles  = this.reflecotr.getAllAndOverride<Role[]>(ROLES_KEY, [
    context.getHandler(), 
    context.getClass()
  ])
  if(!RequiredRoles){
    return true; 
  }

  const req = context.switchToHttp().getRequest<Request>(); // Extracting request object from ExecutionContext

    // accesstoken / refreshtoken hia el esm eli bch tabath bih el request 

   const refreshTokenData = req.headers['refreshtoken'] as string;
   const decoded = this.jwtService.decode(refreshTokenData);
    const userrole = decoded.role as string ;

    if (!userrole) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const hasRequiredRole = RequiredRoles.some((role) =>
      userrole?.includes(role));

    if(!hasRequiredRole){
      throw new ForbiddenException('You do not have permission to access this resource , invalid user role ');
    }
    return true;
  }
}
