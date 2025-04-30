import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';


export class CategoryRoutes {

  static get routes(): Router {

    const router = Router();

//     const emailService = new EmailService(
//       envs.MAILER_SERVICE,
//       envs.MAILER_EMAIL,
//       envs.MAILER_SECRET_KEY,
//       envs.SEND_EMAIL
//   )
    const categoryService = new CategoryService()
    const controller = new CategoryController(categoryService)
    
    // Definir las rutas
    router.post('/', [ AuthMiddleware.validateJWT ], controller.createCategory );
    router.get('/', controller.getCategory );

    return router;
  }
}
