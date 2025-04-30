import path from 'path'
import fs from 'fs'
import { UploadedFile } from "express-fileupload";
import { Uuid } from '../../config/uuid.adapter';
import { CustomError } from '../../domain';
export class FileUploadService {
    constructor(
        private readonly uuid = Uuid.v4
    ) {}
    private checkFolder( folderPath: string ) {
        //Si no existe que se cree la carpeta!!! importante el !
       if ( !fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
       }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {

        try {
            console.log(file)
            const fileExtension = file.mimetype.split('/').at(1) ?? ''
            const destination = path.resolve( __dirname, '../../../', folder)
            if ( !validExtensions.includes(fileExtension) )
                throw CustomError.badRequest(`Invalid extension: ${ fileExtension }, valid ones: ${validExtensions}`)
            this.checkFolder( destination )

            const fileName = `${ this.uuid() }.${ fileExtension }`

            file.mv(`${destination}/${fileName}`)
            return { fileName }
            // file.mv(destination + `/mi-imagen.${fileExtension}`)
        } catch (error) {
            console.log({error})
            throw error;
        }
    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        const fileNames = await Promise.all(
            files.map(file => this.uploadSingle(file, folder, validExtensions))
        )

        return fileNames
    }
}