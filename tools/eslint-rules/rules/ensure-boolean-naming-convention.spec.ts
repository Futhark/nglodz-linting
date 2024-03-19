import { TSESLint } from "@typescript-eslint/utils";
import { rule, RULE_NAME } from "./ensure-boolean-naming-convention";

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
});

ruleTester.run(RULE_NAME, rule, {
    valid: [
        `
            interface TodoItem {
                isCompleted: boolean;
                isIsland: boolean;
                shouldHavePrefix: boolean;
            }
        `,
        `
            interface TodoItemApiResponse {
                completed: boolean;
            }
        `,
    ],
    invalid: [
        {
            code: `interface TodoItem { completed: boolean; }`,
            errors: [
                {
                    messageId: "booleanPropertyShouldHavePrefix",
                    suggestions: [
                        {
                            messageId:
                                "booleanPropertyShouldHavePrefixSuggestion",
                            output: `interface TodoItem { isCompleted: boolean; }`,
                        },
                        {
                            messageId:
                                "booleanPropertyShouldHavePrefixSuggestion",
                            output: `interface TodoItem { hasCompleted: boolean; }`,
                        },
                        {
                            messageId:
                                "booleanPropertyShouldHavePrefixSuggestion",
                            output: `interface TodoItem { shouldCompleted: boolean; }`,
                        },
                    ],
                },
            ],
        },
    ],
});
