import { CategoryModel } from "../../data/mongo/models/category.model"
import { CustomError } from "../../domain"
import { CreateCategoryDto } from "../../domain/dtos/auth/category/create-category.dto"
import { UserEntity } from "../../domain/entities/user.entity"
import { PaginationDto } from "../../domain/shared/pagination.dto"

export class CategoryService {
    constructor(

    ) {}

    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity) {
         const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name })
         if (categoryExists) throw CustomError.badRequest('Category already exists')

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save()

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async getCategories(paginationDto: PaginationDto) {
        try {
            // const total = await CategoryModel.countDocuments()
            const {page, limit } = paginationDto
            // const categories = await CategoryModel.find()
            // .skip((page - 1) * limit)
            // .limit(limit)

            const [total, categories] = await Promise.all( [
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]
            )


            console.log(categories)
            
            return {
                page,
                limit,
                total,
                next: `/api/categories?page=${ (page + 1)}&limit=${limit}`,
                prev:  (page - 1 > 0) ? `/api/categories?page=${ (page - 1)}&limit=${limit}` : null,
                categories: categories.map(
                    ({id, name, available}) => {
                        return {id, name, available}
                    }
                )
            }
            
        } catch (error) {
            throw CustomError.internalServer(`Internal Server Error`)
            
        }
    }
}

