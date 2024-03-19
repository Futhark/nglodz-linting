import { TSESLint } from "@typescript-eslint/utils";
import { rule, RULE_NAME } from "./ban-rxjs-in-components";

const ruleTester = new TSESLint.RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
});

ruleTester.run(RULE_NAME, rule, {
    valid: [
        `import { Component } from "@angular/core";
        // import { of } from "rxjs";`,
    ],
    invalid: [
        {
            code: `import { Component } from "@angular/core";
            import { of } from "rxjs";`,
            errors: [
                {
                    messageId: "rxJsImport",
                    line: 2,
                },
            ],
        },
    ],
});
