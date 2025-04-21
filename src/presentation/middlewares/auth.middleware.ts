import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddleware {
    static async validateJWT( req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization')
        if ( !authorization ) return res.status(401).json({ error: 'No token provider' })
        if ( !authorization.startsWith('Bearer')) return res.status(401).json({ error: 'Invalid Bearer Token'})
            
        //Ya que todo está junto, separamos por cada espacio, y tomamos la segunda posición, que es donde está el token.
        const token = authorization.split(' ').at(1) || '' // at(1) es igual a decir authorization.split(' ')[1]

        try {
            const payload = await JwtAdapter.validateToken<{id: string}>(token)
            if ( !payload ) return res.status(401).json({error: 'Invalid token.'})
            
            const user = await UserModel.findById( payload.id )
            if ( !user ) return res.status(401).json({error: 'Invalid token - user'})
            req.body.user = UserEntity.fromObject(user)
            //procede con el siguiente middlleware:
            next()
            
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Internal server error.'})
        }
    }
}