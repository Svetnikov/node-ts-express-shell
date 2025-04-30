import { NextFunction, Request, Response } from "express";


export class TypeMiddleware {
    static validTypes(validTypes: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            // const type = req.params.type;
            //Como la url es '/multiple/products'
            //hay que sacar "products" el cual es el type.
            const type = req.url.split('/').at(2) ?? ''
        if ( !validTypes.includes(type)) return res.json({error: `Invalid type ${type}, valid ones: ${validTypes}`})
            next()
        }
    
    }
}