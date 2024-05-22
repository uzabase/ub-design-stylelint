import { RULES } from "./rules";

module.exports = RULES.map((rule) => new rule().createPlugin());
