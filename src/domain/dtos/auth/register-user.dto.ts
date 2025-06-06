import { regularExps } from "../../../config"

export class RegisterUserDto {
    private constructor(
        public name: string,
        public email: string,
        public password: string,
    ) { }

    static created(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, email, password } = object

        if (!name) return ['Missing name',]

        if (!email) return ['Missing email',]

        if (!regularExps.email.test(email)) return ['Email is not valid',]

        if (!password) return ['Missing password',]

        if (password.length < 6) return ['Password too short',]

        return ['', new RegisterUserDto(name, email, password)]
    }
}