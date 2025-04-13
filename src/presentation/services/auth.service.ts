import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/auth/register.dto";
import { UserEntity } from "../../domain/entities/user.entity";

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
            await user.save()

            const { password, ...userEntity} = UserEntity.fromObject(user)

            return {
                user: userEntity,
                token: 'ASD'
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
        return 'ok'
    }
}