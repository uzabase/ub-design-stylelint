import type { PostcssResult } from "stylelint";
import type { Root } from "postcss";
import { BaseRule } from "./base.rule";
import { SpTokenTypes, tokens } from "@sp-design/token/lib/speeda-tokens";
import Declaration from "postcss/lib/declaration";
import { RuleContext } from "stylelint";
import { RuleMessages } from "../types/rule.type";

/**
 * Rule：HEXコードをsp-design-tokenに書き換えるやーつ
 */

export class ReplaceSpTokenSassRule extends BaseRule {
  protected readonly _name = "@sp-design/replace-sp-token-sass";
  protected readonly _messages: RuleMessages = {
    reject: "",
  };
  protected readonly _meta = {
    url: "",
    fixable: true,
  };

  protected validate(
    root: Root,
    result: PostcssResult,
    context: RuleContext,
  ): void {
    // TODO rgbの変換と候補出し
    const putForwardCandidates = (value: string) =>
      Object.keys(tokens).filter(
        (token) => -1 < value.indexOf(tokens[token]) && (token as SpTokenTypes),
      );

    const tsToSassVariable = (tokens: string[]) =>
      tokens.map((token) => "token.$" + token.replaceAll("_", "-"));

    const walkColor = (decl: Declaration, regex: RegExp, area: string) => {
      const { value } = decl;

      if (/.*#{.*|^(?!.*(#|rgb)).*$/.test(value)) return;

      let candidate = putForwardCandidates(value);

      if (candidate.length === 0) {
        this._messages.reject =
          "@sp-design/tokenに無い色を使っているみたい？ここ→ " + value;
      } else {
        const filteredCandidate = candidate.filter(
          (token) => regex.test(token) && token,
        );

        if (filteredCandidate.length === 0) {
          this._messages.reject =
            "指定されてる色が" +
            area +
            "で使う色じゃないっぽい🤔→ " +
            decl.value;
        } else if (filteredCandidate.length === 1) {
          if (context.fix) {
            this._messages.reject = "候補が1つだったのでfixしとくわ";
            decl.value = decl.value.replace(
              tokens[filteredCandidate[0]],
              tsToSassVariable(filteredCandidate)[0],
            );
          } else {
            this._messages.reject =
              "候補が1つだったよ→ " + tsToSassVariable(filteredCandidate)[0];
          }
        } else {
          this._messages.reject =
            "@sp-design/tokenを使ってね☆ HEXコードから見た候補はこれ→ " +
            tsToSassVariable(filteredCandidate).join(", ");
        }
      }

      this.report({ result, node: decl });
    };

    root.walkDecls(/background(-color)?/, (decl) => {
      walkColor(decl, /surface|background/, "背景");
    });

    root.walkDecls(/border(.*)?/, (decl) => {
      walkColor(decl, /border/, "ボーダー");
    });

    root.walkDecls("color", (decl) => {
      walkColor(decl, /text/, "テキスト");
    });
  }
}
