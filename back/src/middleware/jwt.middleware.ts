import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'ITINOV-cde-laro',
      });
      if (!decoded || typeof decoded !== 'object') {
        throw new Error('Invalid token structure');
      }
      request.user = decoded;
    } catch (err: any) {
      throw new UnauthorizedException("Invalid or malformed token");
    }

    return true;
  }
}
