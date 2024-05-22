import type { NewableClass } from "../types/utils.type";
import type { BaseRule } from "./base.rule";
import { ReplaceSpTokenSassRule } from "./replace-sp-token-sass.rule";

export const RULES: NewableClass<BaseRule>[] = [ReplaceSpTokenSassRule];
