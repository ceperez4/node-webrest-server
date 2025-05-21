import { sign, verify, } from 'jsonwebtoken'
import type { StringValue } from "ms";
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

    static generateToken(payload: any, duration: StringValue = '2h') {
        const jwt = sign(
            { ...payload },
            JWT_SEED,
            { expiresIn: duration }
        )
        return jwt
    }

    static validateToken(token: string) {
        try {
            const decodedToken = verify(token, JWT_SEED);
            return decodedToken
        } catch {
            return null
        }
    }
}