import { CreateTodoDTO, TodoDatasource, TodoEntity, TodoRepository, UpdateTodoDTO } from "../../domain";

export class TodoRepositoryImpl implements TodoRepository {
    constructor(
        private readonly datasource: TodoDatasource
    ) { }

    create(createTodoDto: CreateTodoDTO): Promise<TodoEntity> {
        return this.datasource.create(createTodoDto);
    }
    getAll(): Promise<TodoEntity[]> {
        return this.datasource.getAll();
    }
    findById(id: number): Promise<TodoEntity> {
        return this.datasource.findById(id);
    }
    updateById(updateTodoDto: UpdateTodoDTO): Promise<TodoEntity> {
        return this.datasource.updateById(updateTodoDto);
    }
    deleteById(id: number): Promise<TodoEntity> {
        return this.datasource.deleteById(id)
    }

}