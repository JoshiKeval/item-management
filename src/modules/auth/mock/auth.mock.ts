import { MockType } from '@core/utils/type.utils';
import { AuthService } from '../auth.service';
import { UsersRepository } from '@core/database/postgres';
import { MailService } from '../../mail/mail.service';

export const mockAuthService: MockType<AuthService> = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  verifyAccount: jest.fn(),
};

export const mockUsersRepository: MockType<UsersRepository> = {
  fetchOne: jest.fn(),
  saveUser: jest.fn(),
  create: jest.fn(),
};

export const mockMailService: MockType<MailService> = {
  sendRegistrationEmail: jest.fn(),
};
