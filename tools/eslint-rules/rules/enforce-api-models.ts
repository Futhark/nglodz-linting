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

import { ESLintUtils } from "@typescript-eslint/utils";
import { getParserServices } from "@typescript-eslint/utils/eslint-utils";

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-enforce-api-models"
export const RULE_NAME = "enforce-api-models";

const httpClientEnforcedMethods = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "request",
];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        type: "problem",
        docs: {
            description: `Enforces proper usage of HttpClient methods and API model naming.`,
            recommended: "strict",
        },
        schema: [],
        messages: {
            httpClientTypedMethod: `HttpClient methods should be typed with *ApiResponse models. e.g. \`httpClient.get<TodoApiResponse>(...)\``,
            noExportApiResponse: `API response models should not be exported.`,
        },
    },
    defaultOptions: [],
    create(context) {
        const services = getParserServices(context);
        const checker = services.program.getTypeChecker();

        return {
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
            "ExportNamedDeclaration > TSInterfaceDeclaration[id.name=/.*ApiResponse/]"(
                node
            ) {
                context.report({
                    node,
                    messageId: "noExportApiResponse",
                });
            },
        };
    },
});
