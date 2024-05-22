import { setupTest } from "../setup-test";
import dedent from "ts-dedent";
import { ReplaceSpTokenSassRule } from "../../src/rules/replace-sp-token-sass.rule";

const { testRule, rule } = setupTest(ReplaceSpTokenSassRule);

testRule({
  ruleName: rule.name,
  customSyntax: "postcss-scss",
  config: true,
  accept: [
    {
      code: dedent`
      .a {
        background: token.$color-primitive-amber-30 0 0;
      }`,
    },
  ],
  reject: [
    {
      code: dedent`
      .a {
        background: #000 0 0;
      }`,
      message: rule.formatMessages(
        "@sp-design/tokenに無い色を使っているみたい？ここ→ #000 0 0",
      ).reject,
    },
    {
      code: dedent`
      .a {
        background: #dee8ff 0 0;
      }`,
      message: rule.formatMessages(
        "指定されてる色が背景で使う色じゃないっぽい🤔→ #dee8ff 0 0",
      ).reject,
    },
    {
      code: dedent`
      .a {
        background: #f9e8b3 0 0;
      }`,
      message: rule.formatMessages(
        "候補が1つだったよ→ token.$color-semantic-surface-warning-3",
      ).reject,
    },
  ],
});
