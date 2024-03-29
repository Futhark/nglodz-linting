/**
 * This file sets you up with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

import {
    AST_NODE_TYPES,
    ESLintUtils,
    TSESTree,
} from "@typescript-eslint/utils";

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-ensure-boolean-naming-convention"
export const RULE_NAME = "ensure-boolean-naming-convention";

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
