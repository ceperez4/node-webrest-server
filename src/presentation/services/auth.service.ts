import { bcryptdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

    constructor() { }

    /*********************************************************/
    /*********************************************************/
    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if (existUser) throw CustomError.badRequest('Email alredy exist')

        try {
            const user = new UserModel(registerUserDto)

            user.password = bcryptdapter.hash(registerUserDto.password);

            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user)

            return { userEntity, token: 'abc' }
        } catch (error) {
            throw error
        }

    }

    /*********************************************************/
    /*********************************************************/
    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email })

        if (!user) throw CustomError.badRequest('Email not exist')

        try {

            const isMatching = bcryptdapter.compare(loginUserDto.password, user.password!)

            if (!isMatching) throw CustomError.badRequest('Password is not valid')

            const { password, ...userEntity } = UserEntity.fromObject(user)

            const token = JwtAdapter.generateToken({
                id: userEntity.id,
                email: userEntity.email
            })

            return { userEntity, token: token }
        } catch (error) {
            throw error
        }


    }
}