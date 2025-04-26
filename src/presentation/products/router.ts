import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { ProductService } from '../services/product.service';


export class ProductRoutes {

  static get routes(): Router {

    const router = Router();
    const service = new ProductService()
    const controller = new ProductController(service)

//     const emailService = new EmailService(
//       envs.MAILER_SERVICE,
//       envs.MAILER_EMAIL,
//       envs.MAILER_SECRET_KEY,
//       envs.SEND_EMAIL
//   )
      // const categoryService = new CategoryService()
      // const controller = new CategoryController(categoryService)
    
    // Definir las rutas
    router.get('/', controller.getProducts );
    router.post('/', [AuthMiddleware.validateJWT], controller.createProducts );
    

    return router;
  }
}