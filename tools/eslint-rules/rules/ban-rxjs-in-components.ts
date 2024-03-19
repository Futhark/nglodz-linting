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

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-ban-rxjs-in-components"
export const RULE_NAME = "ban-rxjs-in-components";

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
