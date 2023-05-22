import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UserService } from '../user/user.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.userService.deleteUnVerifiedAccounts();
  }
}
