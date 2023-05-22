import { IsEnum, IsString } from 'class-validator';

import { EBanUnBan, EGrade } from '../../types/user.type';

const EBanUnBanGrade = { ...EBanUnBan, ...EGrade };

export class BanUnbanUpgradeDowngradeDto {
  @IsEnum(EBanUnBanGrade)
  readonly method: EGrade | EBanUnBan;

  @IsString()
  readonly id: string;
}
