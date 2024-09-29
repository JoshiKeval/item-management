export const CreateUserResp = {
  name: 'ramdev',
  email: 'ramdev@yopmail.com',
  password: '$2b$10$ckikQdM4j02ZTTyr4aiSlOmxb2jggxr3d/bRer5HYVEjIRg/vAiNS',
  emailVerificationToken: '8edfdd31844566cf943348a82efd8a0ea37b68a6',
  emailVerifiedAt: '2024-09-29 23:44:28.371',
  isEmailVerified: true,
  status: 'Inactive',
};

export const SignInMockReqDto = {
  name: 'ramdev',
  email: 'ramdev@yopmail.com',
  password: 'password',
};

export const AccountVerifyMockReqDto = {
  token: '8edfdd31844566cf943348a82efd8a0ea37b68a6',
};

export const UserResp = {
  name: 'ramdev',
  email: 'ramdev@yopmail.com',
  password: '$2b$10$ckikQdM4j02ZTTyr4aiSlOmxb2jggxr3d/bRer5HYVEjIRg/vAiNS',
  emailVerificationToken: '8edfdd31844566cf943348a82efd8a0ea37b68a6',
  emailVerifiedAt: '2024-09-29 23:44:28.371',
  isEmailVerified: false,
  status: 'Inactive',
};

export const LoginMockReqDto = {
  email: 'ramdev@yopmail.com',
  password: 'password',
};

export const FeatchUserResp = {
  id: 'b5bc4435-a3c0-48a4-bbd5-bd0c91a675cb',
  name: 'ramdev',
  email: 'ramdev@yopmail.com',
  password: '$2b$10$ckikQdM4j02ZTTyr4aiSlOmxb2jggxr3d/bRer5HYVEjIRg/vAiNS',
  emailVerificationToken: '8edfdd31844566cf943348a82efd8a0ea37b68a6',
  emailVerifiedAt: '2024-09-29 23:44:28.371',
  isEmailVerified: true,
  status: 'Active',
};

export const SignInMockResDto = {
  userId: 'a3f1aee6-901b-46cf-9105-5b682b4c0ce7',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZjFhZWU2LTkwMWItNDZjZi05MTA1LTViNjgyYjRjMGNlNyIsInN0YXR1cyI6IkFjdGl2ZSIsImlhdCI6MTcyNzYzODgwMSwiZXhwIjoxNzI4Njc1NjAxfQ.S1RRRGYBtznFunhz7_4KaVJl1WZ-OfIsTkh66E8OzQk',
};
