import type { PostcssResult, Severity } from "stylelint";
import type { Node } from "postcss";

export type RuleName = `@sp-design/${string}`;
export type RuleMessages = { reject: string };
export type FormattedRuleMessage = `${string} (${RuleName})`;

export type RuleReportOptions = {
  result: PostcssResult;
  node: Node;
  severity?: Severity;
  message?: FormattedRuleMessage;
};
