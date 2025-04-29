import { CategoryModel } from "../../data/mongo/models/category.model"
import { ProductModel } from "../../data/mongo/models/product.model"
import { CustomError } from "../../domain"
import { CreateCategoryDto } from "../../domain/dtos/auth/category/create-category.dto"
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto"
import { UserEntity } from "../../domain/entities/user.entity"
import { PaginationDto } from "../../domain/shared/pagination.dto"

export class ProductService {
    constructor(

    ) {}

    async createProduct( createProductDto: CreateProductDto) {
         const productExists = await ProductModel.findOne({ name: createProductDto.name })
         if (productExists) throw CustomError.badRequest('Product already exists')

        try {
            const product = new ProductModel( createProductDto )

            await product.save()

            return product
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async getProducts(paginationDto: PaginationDto) {
        try {
            // const total = await CategoryModel.countDocuments()
            const {page, limit } = paginationDto
            // const categories = await CategoryModel.find()
            // .skip((page - 1) * limit)
            // .limit(limit)

            const [total, products] = await Promise.all( [
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')

            ]
            )


            console.log(products)
            
            return {
                page,
                limit,
                total,
                next: `/api/products?page=${ (page + 1)}&limit=${limit}`,
                prev:  (page - 1 > 0) ? `/api/products?page=${ (page - 1)}&limit=${limit}` : null,
                products
            }
            
        } catch (error) {
            throw CustomError.internalServer(`Internal Server Error`)
            
        }
    }
}

