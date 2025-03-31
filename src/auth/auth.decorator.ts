import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export function Auth() {
  return UseGuards(AuthGuard);
}

