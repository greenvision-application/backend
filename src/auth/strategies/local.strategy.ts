import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'usernameOrEmail' });
  }

  async validate(usernameOrEmail: string, password: string) {
    const user = await this.authService.validateUser({
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
