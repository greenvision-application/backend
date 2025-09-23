import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import keys from 'constants/keys';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: keys.secretJwt,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
