import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../Schemas/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>(); // Extracting request object from ExecutionContext

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    const [type, accessToken] = authHeader.split(' ');
    if (type !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid authorization header format!');
    }

    const decoded = this.jwtService.decode(accessToken);
    const userRole = decoded?.role as string;

    if (!userRole) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const hasRequiredRole = requiredRoles.some((role) => userRole.includes(role));

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have permission to access this resource, invalid user role');
    }
    return true;
  }
}
