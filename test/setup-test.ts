import {
  getTestRule,
  getTestRuleConfigs,
  TestRule,
  TestRuleConfigs,
} from "jest-preset-stylelint";
import { BaseRule } from "../src/rules/base.rule";
import { NewableClass } from "../src/types/utils.type";

type Output = {
  testRule: TestRule;
  testRuleConfigs: TestRuleConfigs;
  rule: BaseRule;
};

const PATH_INDEX = "./src/index.ts";

export function setupTest(rule: NewableClass<BaseRule>): Output {
  const testRule = getTestRule({ plugins: [PATH_INDEX] });
  const testRuleConfigs = getTestRuleConfigs({ plugins: [PATH_INDEX] });

  return { testRule, testRuleConfigs, rule: new rule() };
}
