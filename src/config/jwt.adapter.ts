import jwt from 'jsonwebtoken';
import { envs } from './envs';


const JWT_SEED = envs.JWT_SEED;



export class JwtAdapter {

  // DI?

  static async generateToken( payload:any, duration: string = '2h' ) {

    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: "2h" }, (err, token) => {
        
        if ( err ) return resolve(null);

        resolve(token)

      });
    })
  }


  public static validateToken<T>(token: string): Promise<T | null > {

    return new Promise( (resolve)=> {

        jwt.verify( token, JWT_SEED, (err, decoded ) => {
          if ( err ) return resolve(null)
            return resolve(decoded as T)
        })
    }
  )
  }

}