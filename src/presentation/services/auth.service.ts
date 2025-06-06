import mongoose from "mongoose";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserModel } from "../../data/mongo/models/user.model";
import { JwtAdapter } from "../../config/jwt.adapter";
import { EmailService } from "./email.service";
import { envs } from "../../config/envs";

//El servicio es únicamente para validar y mandar la información a la DB.
export class AuthService {
    constructor(
        private readonly emailService: EmailService
    ) {}

    public async registerUser( registerUserDto: RegisterUserDto) {
        const { email } = registerUserDto
        const existUser = await UserModel.findOne({ email })
        if ( existUser ) throw CustomError.badRequest('Email already exist.');
        
        try {
            const user = new UserModel(registerUserDto)
            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save()

            await this.sendEmailValidationLink( user.email! )

            const { password, ...userEntity} = UserEntity.fromObject(user)

            const token = await JwtAdapter.generateToken({ id: user.id })
            if (!token) throw CustomError.internalServer('Error while creating jwt.')

            return {
                user: userEntity,
                token: token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser( loginUserDto: LoginUserDto) {
        
        try {
        const user = await UserModel.findOne({email: loginUserDto.email})
        console.log(user)
        if (!user) throw CustomError.badRequest('Correo no registrado.')
        const passHashed = user.password
        const isMatch = bcryptAdapter.compare(loginUserDto.password, passHashed)
        if (!isMatch) throw CustomError.badRequest('Contraseña incorrecta.')
        const { password, ...userEntity} = UserEntity.fromObject(user)
        
        const token = await JwtAdapter.generateToken({ id: user.id })
        if (!token) throw CustomError.internalServer('Error while creating jwt.')
        return {
            user: userEntity,
            token
        }
        } catch (error) {
            throw CustomError.badRequest(`${error}`)
        }
        
    }

    private sendEmailValidationLink = async( email: string ) => {
        const token = await JwtAdapter.generateToken( { email } )
        if ( !token ) throw CustomError.internalServer('Error getting token')
        
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`
        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${ link }">Validate your Email: ${ email }</a>
        `

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail( options )
        if ( !isSent ) throw CustomError.internalServer('Error msending email')
        
        return true
    } 

    public validateEmail = async (token: string) => {
        
        const payload = await JwtAdapter.validateToken(token)
        console.log(payload)
        if (!payload) throw CustomError.unauthorized('Invalid token')

            const { email } = payload as { email: string }
            if (!email) throw CustomError.internalServer('Email not in token')

            const user = await UserModel.findOne({ email })
            if (!user) throw CustomError.internalServer('Email not exists')

            user.emailValidated = true

            await user.save()

            return true
}
}