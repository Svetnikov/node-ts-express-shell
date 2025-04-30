import { Request, Response } from "express"
import { CustomError } from "../../domain"
import { FileUploadService } from "../services/file-upload.service"
import { UploadedFile } from "express-fileupload"


export class FileUploadController {
    //En los controladores, se usa método de flecha para evitar problemas con objetos,
    //ya que pueden tener problemas al definirse si se usa un método
    constructor(
        private readonly fileuploadService: FileUploadService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if ( error instanceof CustomError)
            return res.status(error.statusCode).json(error.message)
        console.log(error)
        return res.status(500).json({ error: 'Internal server error.'})
    }

    uploadFile = async (req: Request, res: Response) => {

        const type = req.params.type;
        const validTypes = ['users', 'products', 'categories']
        if ( !validTypes.includes(type)) return res.status(400).json({error: `Invalid type ${type}, valid ones: ${validTypes}`})
        //único archivo: objeto
        const files = req.files
        if (!req.files || Object.keys(req.files).length === 0 ) {
            return res.status(400).json({ error: 'No files were selected'})
        }
        const file = req.body.files.at(0) as UploadedFile //Para denotar que la variable es solo de tipo UploadedFile y no de más tipados
        this.fileuploadService.uploadSingle( file, `uploads/${ type}` )
        .then( uploaded => res.json(uploaded)) // lo mismo que decir res.json y ya
        .catch( err => this.handleError(err, res))
    }
    uploadMultipleFiles = async (req: Request, res: Response) => {
        //varios archivos: arreglo de objetos

        const type = req.params.type;
        const validTypes = ['users', 'products', 'categories']
        if ( !validTypes.includes(type)) return res.status(400).json({error: `Invalid type ${type}, valid ones: ${validTypes}`})
        //único archivo: objeto
        // const files = req.files 
        
        const files = req.body.files as UploadedFile[] //Para denotar que la variable es solo de tipo UploadedFile y no de más tipados
        this.fileuploadService.uploadMultiple( files, `uploads/${ type}` )
        .then( uploaded => res.json(uploaded)) // lo mismo que decir res.json y ya
        .catch( err => this.handleError(err, res))
    }

    }
