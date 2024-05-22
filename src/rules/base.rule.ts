import {
  createPlugin,
  type PostcssResult,
  type Rule as stylelintRule,
  type RuleBase,
  RuleContext,
  RuleMeta,
  type Severity,
  utils,
} from "stylelint";
import type { Root } from "postcss";
import type {
  FormattedRuleMessage,
  RuleMessages,
  RuleName,
  RuleReportOptions,
} from "../types/rule.type";
import * as PostCSS from "postcss";

/**
 * ルールの抽象クラス
 */
export abstract class BaseRule {
  protected abstract readonly _name: RuleName;
  protected abstract readonly _messages: RuleMessages;
  protected abstract readonly _meta: RuleMeta;
  protected readonly _severity: Severity = "error";

  protected abstract validate(
    root: Root,
    result: PostcssResult,
    context: RuleContext,
  ): void;

  get name(): RuleName {
    return this._name;
  }

  get meta(): RuleMeta {
    return this._meta;
  }

  get messages(): RuleMessages {
    return this._messages;
  }

  get severity(): Severity {
    return this._severity;
  }

  createPlugin(): ReturnType<typeof createPlugin> {
    return createPlugin(
      this.name,
      this.createRuleFunc() as unknown as stylelintRule,
    );
  }

  formatMessages(rejectMessages?: string): RuleMessages {
    const messages: RuleMessages = {
      reject: rejectMessages || this.messages.reject,
    };
    return utils.ruleMessages(this.name, messages);
  }

  protected formatMessage(message: string): FormattedRuleMessage {
    return `${message} (${this.name})`;
  }

  protected report({
    result,
    node,
    message,
    severity,
  }: RuleReportOptions): void {
    const reportMessage = message || this.formatMessages().reject;

    utils.report({
      ruleName: this.name,
      severity: severity || this.severity,
      message: reportMessage,
      result,
      node,
    });
  }

  private createRuleFunc(): RuleBase {
    return (primaryOption, secondaryOptions, context) => {
      return (postcssRoot, postcssResult) => {
        if (!utils.validateOptions(postcssResult, this.name)) return;
        this.validate(postcssRoot, postcssResult, context);
      };
    };
  }
}
