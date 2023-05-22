import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  Header,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LocalAuthGuard } from '../guard/local.guard';
import { Public } from '../decorators/public.decorator';
import { IUser } from '../types/user.type';
import { CheckTokenDto } from './dto/check-token.dto';
import { EmailVerificationDto } from './dto/key-verification';
import { GoogleOAuthGuard } from '../guard/google-oauth.guard';
import { FacebookGuard } from '../guard/facebook.guard';
import { GenerateForgotPasswordKeyDto } from './dto/generate-forgot-password-key.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* SIGN UP
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  //* EMAIL VERIFICATION
  @Post('emailverification')
  emailVerification(@Body() body: EmailVerificationDto) {
    return this.authService.emailVerification(body);
  }

  //* SIGN IN
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signIn(@CurrentUser() user: IUser) {
    return this.authService.signIn(user);
  }

  //* CHECK TOKEN
  @Post('checktoken')
  checkToken(@Body() body: CheckTokenDto) {
    return this.authService.checkToken(body.access_token);
  }

  //* SEND FORGOT PASSWORD
  @Post('generateforgotpasswordkey')
  generateForgotPasswordKey(@Body() body: GenerateForgotPasswordKeyDto) {
    return this.authService.generateForgotPassword(body);
  }

  //* RESET PASSWORD
  @Post('resetpassword')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  //* GOOGLE SIGN UP/SIGN IN
  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {}

  //* GOOGLE REDIRECT
  @Post('google/redirect')
  // @UseGuards(GoogleOAuthGuard)
  googleLoginRedirect(@Body() body) {
    console.log(body);

    return this.authService.googleLoginRedirect(body);
  }

  //* FACEBOOK SIGN UP/SIGN IN
  @Get('facebook/login')
  @UseGuards(FacebookGuard)
  facebookLogin() {}

  //* FACEBOOK REDIRECT
  @Post('facebook/redirect')
  // @UseGuards(FacebookGuard)
  facebookLoginRedirect(@Body() body) {
    return this.authService.facebookLoginRedirect(body);
  }
}
