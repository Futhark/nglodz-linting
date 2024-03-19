// Links

-   AST: https://typescript-eslint.io/play/
-   Kopalnia reguł na których można się wzorować: https://github1s.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/rules/adjacent-overload-signatures.ts
-   Testy dla angular-eslint: https://github1s.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/tests/rules/component-selector/cases.ts
-   parser templatek angularowych: https://github1s.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/rules/banana-in-box.ts
-   selektory: https://eslint.org/docs/latest/extend/selectors

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

// DEMO 3

```typescript
export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        type: "problem",
        docs: {
            description: `Ensures that boolean properties are named in a consistent way. For example, having "is" or "has" prefix.`,
            recommended: "recommended",
        },
        schema: [
            {
                type: "object",
                properties: {
                    allowedPrefixes: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
                required: ["allowedPrefixes"],
                additionalProperties: false,
            },
        ],
        messages: {
            booleanPropertyShouldHavePrefix: `Boolean property should have prefix. Available prefixes: {{allowedPrefixes}}`,
            booleanPropertyShouldHavePrefixSuggestion: `Boolean property should have prefix. Change to {{refactoredPropertyName}}`,
        },
        fixable: "code",
        hasSuggestions: true,
    },
    defaultOptions: [
        {
            allowedPrefixes: ["is", "has", "should"],
        },
    ],
    create(context, [options]) {
        const checkBooleanName = (node: TSESTree.Identifier) => {
            console.log(`^(${options.allowedPrefixes.join("|")})[A-Z]`);
            const propertyName = node.name;
            if (
                new RegExp(`^(${options.allowedPrefixes.join("|")})[A-Z]`).test(
                    propertyName
                )
            ) {
                return;
            }

            context.report({
                node,
                messageId: "booleanPropertyShouldHavePrefix",
                data: {
                    allowedPrefixes: options.allowedPrefixes.join(", "),
                },
                suggest: options.allowedPrefixes.map((prefix) => {
                    const refactoredPropertyName = `${prefix}${propertyName
                        .charAt(0)
                        .toUpperCase()}${propertyName.slice(1)}`;

                    return {
                        messageId: "booleanPropertyShouldHavePrefixSuggestion",
                        data: { refactoredPropertyName },
                        fix: (fixer) => {
                            return fixer.replaceText(
                                node,
                                refactoredPropertyName
                            );
                        },
                    };
                }),
            });
        };

        let isInApiResponseContext = false;

        return {
            "TSTypeAnnotation > TSBooleanKeyword"(
                node: TSESTree.TSBooleanKeyword
            ) {
                if (
                    !isInApiResponseContext &&
                    node.parent.parent.type ===
                        AST_NODE_TYPES.TSPropertySignature &&
                    node.parent.parent.key.type === AST_NODE_TYPES.Identifier
                ) {
                    checkBooleanName(node.parent.parent.key);
                }
            },
            "TSInterfaceDeclaration[id.name=/.*ApiResponse/]"() {
                isInApiResponseContext = true;
            },
            "TSInterfaceDeclaration[id.name=/.*ApiResponse/]:exit"() {
                isInApiResponseContext = false;
            },
        };
    },
});
```
