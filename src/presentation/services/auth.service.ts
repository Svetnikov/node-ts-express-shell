import mongoose from "mongoose";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserModel } from "../../data/mongo/models/user.model";
import { JwtAdapter } from "../../config/jwt.adapter";

//El servicio es únicamente para validar y mandar la información a la DB.
export class AuthService {
    constructor(
    ) {}

    public async registerUser( registerUserDto: RegisterUserDto) {
        const { email } = registerUserDto
        const existUser = await UserModel.findOne({ email })
        if ( existUser ) throw CustomError.badRequest('Email already exist.');
        
        try {
            const user = new UserModel(registerUserDto)
            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save()

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
}