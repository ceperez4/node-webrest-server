import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto, } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    /*********************************************************/
    /*********************************************************/
    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message })
            return;
        }
        console.log(error)
        res.status(500).json({ error: `INTERNAL_SERVER_ERROR` })
    }

    /*********************************************************/
    /*********************************************************/
    public createCategory = (req: Request, res: Response) => {

        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if (error) {
            res.status(400).json({ error })
            return;
        }

        this.categoryService.createCategory(createCategoryDto!, req.body.user)
            .then(category => res.status(201).json(category))
            .catch(error => this.handleError(error, res));

    }

    /*********************************************************/
    /*********************************************************/
    public getCategories = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(Number(page), Number(limit));
        if (error) {
            res.status(400).json({ error })
            return
        }

        this.categoryService.getCategories(paginationDto!)
            .then(categories => res.json(categories))
            .catch(error => this.handleError(error, res));
    }

}