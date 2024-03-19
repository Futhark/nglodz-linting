import {
    RULE_NAME as ensureBooleanNamingConventionName,
    rule as ensureBooleanNamingConvention,
} from "./rules/ensure-boolean-naming-convention";
import {
    RULE_NAME as enforceApiModelsName,
    rule as enforceApiModels,
} from "./rules/enforce-api-models";
import {
    RULE_NAME as banRxjsInComponentsName,
    rule as banRxjsInComponents,
} from "./rules/ban-rxjs-in-components";
/**
 * Import your custom workspace rules at the top of this file.
 *
 * For example:
 *
 * import { RULE_NAME as myCustomRuleName, rule as myCustomRule } from './rules/my-custom-rule';
 *
 * In order to quickly get started with writing rules you can use the
 * following generator command and provide your desired rule name:
 *
 * ```sh
 * npx nx g @nx/eslint:workspace-rule {{ NEW_RULE_NAME }}
 * ```
 */

module.exports = {
    /**
     * Apply the imported custom rules here.
     *
     * For example (using the example import above):
     *
     * rules: {
     *  [myCustomRuleName]: myCustomRule
     * }
     */
    rules: {
        [banRxjsInComponentsName]: banRxjsInComponents,
        [enforceApiModelsName]: enforceApiModels,
        [ensureBooleanNamingConventionName]: ensureBooleanNamingConvention,
    },
};
