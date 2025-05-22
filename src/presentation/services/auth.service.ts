import { bcryptdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {

    constructor(
        private readonly emailService: EmailService
    ) { }

    /*********************************************************/
    /*********************************************************/
    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if (existUser) throw CustomError.badRequest('Email alredy exist')

        try {
            const user = new UserModel(registerUserDto)

            user.password = bcryptdapter.hash(registerUserDto.password);

            await user.save();

            await this.sendEmailValidationLink(registerUserDto.email);

            const { password, ...userEntity } = UserEntity.fromObject(user)

            const token = JwtAdapter.generateToken({
                id: userEntity.id,
            })

            return { userEntity, token }
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
            })

            return { userEntity, token: token }
        } catch (error) {
            throw error
        }


    }


    /*********************************************************/
    /*********************************************************/
    public async validateEmail(token: string) {
        try {
            const payload = JwtAdapter.validateToken(token);
            if (!payload) throw CustomError.unauthorized('Invalid Token');

            const { email } = payload as { email: string };

            if (!email) throw CustomError.internalServer('Email not in token');

            const user = await UserModel.findOne({ email });
            if (!user) throw CustomError.internalServer('Email not exist');

            user.emailValidated = true;

            await user.save();

            return true;

        } catch (error) {
            throw error;
        }
    }

    /*********************************************************/
    /*********************************************************/
    private async sendEmailValidationLink(email: string) {
        const token = JwtAdapter.generateToken({ email });

        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }
        const isSend = await this.emailService.sendEmail(options)
        if (!isSend) throw CustomError.internalServer('Error sending email');
        console.log(link)
        return true;
    }
}