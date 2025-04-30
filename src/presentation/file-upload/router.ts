import { Router } from 'express';
import { FileUploadController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';


export class FileUploadRoutes {

  static get routes(): Router {

    const router = Router();

//     const emailService = new EmailService(
//       envs.MAILER_SERVICE,
//       envs.MAILER_EMAIL,
//       envs.MAILER_SECRET_KEY,
//       envs.SEND_EMAIL
//   )
    const controller = new FileUploadController(
      new FileUploadService()
    )
    
    //middleware
    router.use([FileUploadMiddleware.containFiles])
    // Definir las rutas
    router.post('/single/:type', controller.uploadFile );
    router.post('/multiple/:type', controller.uploadMultipleFiles );

    return router;
  }


}