import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

interface TodoItemApiResponse {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoItem {
    id: number;
    title: string;
    completed: boolean;
}

@Injectable({
    providedIn: "root",
})
export class TodoApiService {
    constructor(private readonly httpClient: HttpClient) {}

    public getTodo() {
        return this.httpClient
            .get<TodoItemApiResponse>(
                "https://jsonplaceholder.typicode.com/todos/1"
            )
            .pipe(map(convertTodoItemApiResponseToTodoItem));
    }
}

function convertTodoItemApiResponseToTodoItem(
    todo: TodoItemApiResponse
): TodoItem {
    return {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
    };
}
