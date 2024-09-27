import { UsersRepository } from '@core/database/postgres';
import { Status } from '@core/interfaces';
import { ErrorMessages, jwtVerify } from '@core/utils';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class UserAuthGuard implements CanActivate {
  logger = new Logger('UserAuthGuard');
  constructor(private readonly pgUsersRepo: UsersRepository) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers['x-access-token'] || request.headers['authorization'];

    if (!token) {
      this.logger.error(
        'UserAuthGuard->>token-not-provide',
        new Date().toISOString(),
      );
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    try {
      const user = await jwtVerify(token);
      if (!user) {
        throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
      }

      request.user = user;
      const result = await this.pgUsersRepo.fetchOne({}, {}, { id: user?.id });

      if (result?.deletedAt) {
        throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
      }
      if (result?.status === Status.Inactive) {
        throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
      }

      return request;
    } catch (e) {
      this.logger.error('UserAuthGuard', new Date().toISOString(), {
        e,
      });
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(ErrorMessages.TOKEN_EXPIRED);
      }
      throw new UnauthorizedException();
    }
  }
}
