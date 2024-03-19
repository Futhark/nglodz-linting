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

---

// DEMO 2

```typescript
"parserOptions": {
    "project": [
        "apps/ng-lodz-linting/tsconfig.app.json",
        "apps/ng-lodz-linting/tsconfig.editor.json"
    ]
},
```

```typescript
CallExpression(node) {
    if (node.callee.type !== "MemberExpression") return;
    if (node.callee.property.type !== "Identifier") return;
    if (
        !httpClientEnforcedMethods.includes(
            node.callee.property.name
        )
    )
        return;
    if (node.callee.object.type !== "MemberExpression") return;
    if (
        node.typeArguments?.params[0].type === "TSTypeReference" &&
        node.typeArguments.params[0].typeName.type ===
            "Identifier" &&
        node.typeArguments.params[0].typeName.name.endsWith(
            "ApiResponse"
        )
    )
        return;

    const type = checker.getTypeAtLocation(
        services.esTreeNodeToTSNodeMap.get(node.callee.object)
    );
    const qualifiedName = checker.getFullyQualifiedName(
        type.symbol
    );

    if (
        !qualifiedName.endsWith(
            '@angular/common/http/index".HttpClient'
        )
    )
        return;

    context.report({
        node,
        messageId: "httpClientTypedMethod",
    });
},
```

```typescript
"ExportNamedDeclaration > TSInterfaceDeclaration[id.name=/.*ApiResponse/]"(
    node
) {
    context.report({
        node,
        messageId: "noExportApiResponse",
    });
},
```

---
