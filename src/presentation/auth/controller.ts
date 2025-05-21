import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
    constructor(
        public readonly authService: AuthService
    ) { }

    /*********************************************************/
    /*********************************************************/
    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message })
            return;
        }
        console.log(error)
        res.status(500).json({ error: `INTERNAL_SERVER_ERROR` })
    }

    /*********************************************************/
    /*********************************************************/
    public registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.created(req.body)
        if (error) {
            res.status(400).json({ error })
            return;
        }
        this.authService.registerUser(registerDto!)
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res))

    }

    /*********************************************************/
    /*********************************************************/
    public loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.created(req.body)
        if (error) {
            res.status(400).json({ error })
            return;
        }
        this.authService.loginUser(loginUserDto!)
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res))
    }

    /*********************************************************/
    /*********************************************************/
    public validateEmail = (req: Request, res: Response) => {
        const { token = '' } = req.params;
        this.authService.validateEmail(token)
            .then(() => res.json({ message: 'Email Validated' }))
            .catch(error => this.handleError(error, res))
    }
}