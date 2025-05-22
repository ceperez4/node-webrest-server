import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class CategoryService {

    constructor() { }

    /*********************************************************/
    /*********************************************************/
    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {

        try {
            const categoryExist = await CategoryModel.findOne({ name: createCategoryDto.name });
            if (categoryExist) {
                throw CustomError.badRequest('Category alredy exists')
            }

            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available,
            }

        } catch (error) {
            throw error
        }
    }

    /*********************************************************/
    /*********************************************************/
    async getCategories(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto

        try {

            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            return {
                page,
                limit,
                total,
                categories: categories.map(c => ({
                    id: c.id,
                    name: c.name,
                    available: c.available
                }))
            }

        } catch (error) {
            throw error
        }
    }
}