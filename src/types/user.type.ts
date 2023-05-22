import { ERole, EUserStatus } from '@prisma/client';

enum EGrade {
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
}

enum EBanUnBan {
  BAN = 'ban',
  UNBAN = 'unban',
}

interface IPost {}

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picture: string;
  role: ERole;
  provider: string;
  status: EUserStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface IAccessToken {
  access_token: string;
}

interface IId {
  id: number;
}

export { EGrade, EBanUnBan, IPost, IUser, IAccessToken, IId };
