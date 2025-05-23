import { CategoryModel, ProductModel } from "../../data";
import { CreateCategoryDto, CreateProductDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class ProductService {

    constructor() { }

    /*********************************************************/
    /*********************************************************/
    async createProduct(createProductDto: CreateProductDto) {

        try {
            const productExist = await ProductModel.findOne({ name: createProductDto.name });
            if (productExist) {
                throw CustomError.badRequest('Product alredy exists')
            }

            const product = new ProductModel({
                ...createProductDto,
            });

            await product.save();

            return product

        } catch (error) {
            throw error
        }
    }

    /*********************************************************/
    /*********************************************************/
    async getProducts(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto

        try {

            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ]);

            return {
                page,
                limit,
                total,
                products: products,
            }

        } catch (error) {
            throw error
        }
    }
}