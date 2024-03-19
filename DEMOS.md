// DEMO 1

```typescript
{
  "files": ["*.component.ts"],
  "extends": [],
  "rules": {
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["rxjs", "rxjs/*"],
            "message": "Do not use RxJS in Angular components. Use Signals instead."
          }
        ]
      }
    ]
  }
},
```

`nx generate @nx/eslint:workspace-rule --name=ban-rxjs-in-components`

```typescript
// tests:
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

// rule:
export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        type: "problem",
        docs: {
            description: `Ban rxjs usage in components`,
            recommended: "strict",
        },
        schema: [],
        messages: {
            rxJsImport: `Importing rxjs in components is not allowed. Use signals instead.`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value.startsWith("rxjs")) {
                    context.report({
                        node,
                        messageId: "rxJsImport",
                    });
                }
            },
        };
    },
});
```
