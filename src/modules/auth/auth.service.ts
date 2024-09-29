import { UsersRepository } from '@core/database/postgres';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountVerifyReqDto,
  SignInReqDto,
  SignInResDto,
  SignUpReqDto,
} from './dto';
import {
  comparePassword,
  ErrorMessages,
  generateSHA1,
  hash,
  jwtSign,
  SuccessMessages,
} from '@core/utils';
import { MailService } from '../mail/mail.service';
import { Status } from '@core/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly pgUsersRepo: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  async signUp(payload: SignUpReqDto): Promise<string> {
    const { email, name, password } = payload;

    const isUserExist = await this.pgUsersRepo.fetchOne(
      {},
      {},
      {
        email,
      },
    );

    if (isUserExist) {
      throw new BadRequestException(ErrorMessages.ACCOUNT_ALREADY_EXIST);
    }

    const hashedPassword = await hash(password);
    const hashedEmail = generateSHA1(email);

    const user = this.pgUsersRepo.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedEmail,
    });

    await this.pgUsersRepo.saveUser(user);

    this.mailService.sendRegistrationEmail(email, hashedEmail);

    return SuccessMessages.SIGN_UP;
  }

  async verifyAccount(payload: AccountVerifyReqDto): Promise<string> {
    const { token } = payload;
    const user = await this.pgUsersRepo.fetchOne(
      {},
      {},
      {
        emailVerificationToken: token,
      },
    );

    if (user.isEmailVerified) {
      throw new BadRequestException(ErrorMessages.ACCOUNT_ALREADY_VERIFIED);
    }

    user.status = Status.Active;
    user.emailVerifiedAt = new Date();
    user.isEmailVerified = true;

    await this.pgUsersRepo.saveUser(user);

    return SuccessMessages.MAIL_VERIFY;
  }

  async signIn(payload: SignInReqDto): Promise<SignInResDto> {
    const { email, password } = payload;

    const user = await this.pgUsersRepo.fetchOne(
      {},
      {},
      {
        email,
      },
    );

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
    if (!user?.isEmailVerified) {
      throw new BadRequestException(ErrorMessages.VERIFICATION_PENDDING);
    }

    const isCorrectPassword = await comparePassword(password, user?.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    const tokenPayload = {
      id: user.id,
      status: user.status,
    };

    const jwtToken = jwtSign(tokenPayload);
    return new SignInResDto(user?.id, jwtToken);
  }
}
