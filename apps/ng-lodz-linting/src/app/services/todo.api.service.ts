import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface TodoItem {
    userId: number;
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
        return this.httpClient.get(
            "https://jsonplaceholder.typicode.com/todos/1"
        );
    }
}
