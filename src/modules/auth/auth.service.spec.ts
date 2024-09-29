import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { mockMailService, mockUsersRepository } from './mock/auth.mock';
import { UsersRepository } from '@core/database/postgres';
import {
  AccountVerifyMockReqDto,
  FeatchUserResp,
  LoginMockReqDto,
  SignInMockReqDto,
  UserResp,
} from './mock/auth.fixture';
import {
  comparePassword,
  ErrorMessages,
  jwtSign,
  SuccessMessages,
} from '@core/utils';
import { SignInResDto } from './dto';

jest.mock('@core/utils/crypt.utils.ts', () => ({
  comparePassword: jest.fn(),
  jwtSign: jest.fn(),
  hash: jest.fn(),
  generateSHA1: jest.fn(),
}));
describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: UsersRepository;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SignUp', () => {
    let fetchOne: jest.SpyInstance,
      create: jest.SpyInstance,
      sendRegistrationEmail: jest.SpyInstance,
      saveUser: jest.SpyInstance;

    beforeEach(() => {
      fetchOne = jest.spyOn(usersRepository, 'fetchOne');
      create = jest.spyOn(usersRepository, 'create');
      saveUser = jest.spyOn(usersRepository, 'saveUser');
      sendRegistrationEmail = jest.spyOn(mailService, 'sendRegistrationEmail');
    });

    it('Should signup the user', async () => {
      fetchOne.mockResolvedValueOnce(null);
      sendRegistrationEmail.mockResolvedValue({});
      expect(await service.signUp(SignInMockReqDto)).toEqual(
        SuccessMessages.SIGN_UP,
      );
      expect(fetchOne).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledTimes(1);
      expect(saveUser).toHaveBeenCalledTimes(1);
      expect(sendRegistrationEmail).toHaveBeenCalledTimes(1);
    });

    it('user already exists', async () => {
      fetchOne.mockResolvedValueOnce({});

      await expect(service.signUp(SignInMockReqDto)).rejects.toThrow(
        ErrorMessages.ACCOUNT_ALREADY_EXIST,
      );
      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { email: SignInMockReqDto.email },
      );
      expect(create).toHaveBeenCalledTimes(0);
      expect(saveUser).toHaveBeenCalledTimes(0);
      expect(sendRegistrationEmail).toHaveBeenCalledTimes(0);
    });
  });

  describe('verifyAccount', () => {
    let fetchOne: jest.SpyInstance;
    let saveUser: jest.SpyInstance;

    beforeEach(() => {
      fetchOne = jest.spyOn(usersRepository, 'fetchOne');
      saveUser = jest.spyOn(usersRepository, 'saveUser');
    });

    it('should verify the account successfully', async () => {
      fetchOne.mockResolvedValueOnce(UserResp);
      const result = await service.verifyAccount(AccountVerifyMockReqDto);

      expect(result).toEqual(SuccessMessages.MAIL_VERIFY);
      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { emailVerificationToken: AccountVerifyMockReqDto.token },
      );

      expect(saveUser).toHaveBeenCalledWith({
        ...UserResp,
        isEmailVerified: true,
        emailVerifiedAt: expect.any(Date),
        status: 'Active',
      });
    });

    it('account is already verified', async () => {
      const mockUser = {
        emailVerificationToken: AccountVerifyMockReqDto.token,
        isEmailVerified: true,
      };

      fetchOne.mockResolvedValueOnce(mockUser);
      await expect(
        service.verifyAccount(AccountVerifyMockReqDto),
      ).rejects.toThrow(ErrorMessages.ACCOUNT_ALREADY_VERIFIED);

      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { emailVerificationToken: AccountVerifyMockReqDto.token },
      );
      expect(saveUser).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    let fetchOne: jest.SpyInstance;

    beforeEach(() => {
      process.env.JWT_SALT = 'sdjdlsjdlksjd';
      process.env.JWT_EXPIRES = '3600';

      fetchOne = jest.spyOn(usersRepository, 'fetchOne');
    });

    it('should sign in successfully', async () => {
      fetchOne.mockResolvedValueOnce(FeatchUserResp);
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (jwtSign as jest.Mock).mockReturnValueOnce(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjFhZWU2LTkwMWItNDZjZi05MTA1LTViNjgyYjRjMGNlNyIsInN0YXR1cyIsImlhdCI6MTcyNzYzODgwMSwiZXhwIjoxNzI4Njc1NjAxfQ.S1RRRGYBtznFunhz7_4KaVJl1WZ-OfIsTkh66E8OzQk',
      );

      const result = await service.signIn(LoginMockReqDto);
      expect(result).toEqual(
        new SignInResDto(
          expect.any(String),
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjFhZWU2LTkwMWItNDZjZi05MTA1LTViNjgyYjRjMGNlNyIsInN0YXR1cyIsImlhdCI6MTcyNzYzODgwMSwiZXhwIjoxNzI4Njc1NjAxfQ.S1RRRGYBtznFunhz7_4KaVJl1WZ-OfIsTkh66E8OzQk',
        ),
      );

      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { email: LoginMockReqDto.email },
      );
      expect(comparePassword).toHaveBeenCalledWith(
        LoginMockReqDto.password,
        FeatchUserResp.password,
      );
    });

    it('error if the user does not exist', async () => {
      fetchOne.mockResolvedValueOnce(null);

      await expect(service.signIn(LoginMockReqDto)).rejects.toThrow(
        ErrorMessages.UNAUTHORIZED,
      );

      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { email: LoginMockReqDto.email },
      );
      expect(comparePassword).not.toHaveBeenCalled();
    });

    it('if the email is not verified', async () => {
      const unverifiedUserResp = {
        ...UserResp,
        isEmailVerified: false,
      };

      fetchOne.mockResolvedValueOnce(unverifiedUserResp);

      await expect(service.signIn(LoginMockReqDto)).rejects.toThrow(
        ErrorMessages.VERIFICATION_PENDDING,
      );

      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { email: LoginMockReqDto.email },
      );
      expect(comparePassword).not.toHaveBeenCalled();
    });

    it('if the password is incorrect', async () => {
      fetchOne.mockResolvedValueOnce(FeatchUserResp);
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.signIn(LoginMockReqDto)).rejects.toThrow(
        ErrorMessages.UNAUTHORIZED,
      );

      expect(fetchOne).toHaveBeenCalledWith(
        {},
        {},
        { email: LoginMockReqDto.email },
      );
      expect(comparePassword).toHaveBeenCalledWith(
        LoginMockReqDto.password,
        FeatchUserResp.password,
      );
    });
  });
});
