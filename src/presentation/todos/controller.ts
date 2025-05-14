import { Request, Response } from "express";
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";


export class TodosController {

    constructor(
        private readonly todoRepository: TodoRepository
    ) { }

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error(error)
        res.status(500).json({ error: 'internal server error' });
        return;
    }

    /*********************************************************/
    /*********************************************************/
    public getTodos = (req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
            .execute()
            .then(todos => res.json(todos))
            .catch(error => this.handleError(res, error))
    }

    /*********************************************************/
    /*********************************************************/
    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error))

    }

    /*********************************************************/
    /*********************************************************/
    public createTodo = (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDTO.create(req.body)
        if (error) {
            res.status(400).json({ error })
            return
        }
        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(todo => res.status(201).json(todo))
            .catch(error => this.handleError(res, error))
    }

    /*********************************************************/
    /*********************************************************/
    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDTO.create({
            ...req.body, id
        })
        if (error) {
            res.status(400).json({ error })
            return
        }
        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error))
    }

    /*********************************************************/
    /*********************************************************/
    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error))
    }
}