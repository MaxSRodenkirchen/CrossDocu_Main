"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TitleCaseConverterPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  exceptionsList: "NASA\niPhone\nmacOS\nGitHub",
  preserveMixedCase: true
};
var TitleCaseConverterSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Exception list").setDesc("A list of words whose casing should always be preserved exactly as typed (one word/phrase per line).").addTextArea(
      (text) => text.setPlaceholder("NASA\niPhone").setValue(this.plugin.settings.exceptionsList).onChange(async (value) => {
        this.plugin.settings.exceptionsList = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Auto-preserve mixed-case words").setDesc("If a word already contains an uppercase letter after its first character (e.g. NASA, iPhone), leave it untouched.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.preserveMixedCase).onChange(async (value) => {
        this.plugin.settings.preserveMixedCase = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/styles/ama.ts
var ARTICLES = ["a", "an", "the"];
var COORDINATING_CONJUNCTIONS = ["and", "but", "for", "nor", "or", "so", "yet"];
var SHORT_PREPOSITIONS = ["as", "at", "by", "for", "in", "of", "off", "on", "out", "per", "to", "up", "via"];
var LOWERCASE_WORDS = /* @__PURE__ */ new Set([...ARTICLES, ...COORDINATING_CONJUNCTIONS, ...SHORT_PREPOSITIONS]);
function hasUppercaseAfterFirst(word) {
  for (let i = 1; i < word.length; i++) {
    if (word[i] !== word[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}
function capitalizeFirst(word) {
  if (!word) return word;
  for (let i = 0; i < word.length; i++) {
    if (/\p{L}/u.test(word[i])) {
      return word.substring(0, i) + word[i].toUpperCase() + word.substring(i + 1).toLowerCase();
    }
  }
  return word.toUpperCase();
}
function processWord(token, isEdge, exceptionsSet, preserveMixedCase) {
  const match = token.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
  const prefix = match ? match[1] : "";
  let word = match ? match[2] : token;
  const suffix = match ? match[3] : "";
  if (!word) {
    return token;
  }
  if (exceptionsSet.has(word) || preserveMixedCase && hasUppercaseAfterFirst(word)) {
    return token;
  }
  if (word.includes("-")) {
    const parts = word.split("-");
    const processedParts = parts.map((part, index) => {
      const isPartEdge = isEdge || index === 0 || index === parts.length - 1;
      return processWord(part, isPartEdge, exceptionsSet, preserveMixedCase);
    });
    return prefix + processedParts.join("-") + suffix;
  }
  const lowerWord = word.toLowerCase();
  if (isEdge || !LOWERCASE_WORDS.has(lowerWord)) {
    return prefix + capitalizeFirst(word) + suffix;
  } else {
    return prefix + lowerWord + suffix;
  }
}
var amaStyle = {
  id: "ama",
  label: "AMA",
  convert(input, exceptions, preserveMixedCase) {
    const exceptionsSet = new Set(exceptions);
    const segments = [];
    let currentSegment = "";
    for (let i = 0; i < input.length; i++) {
      currentSegment += input[i];
      if (input[i] === ":") {
        segments.push(currentSegment);
        currentSegment = "";
      }
    }
    if (currentSegment) {
      segments.push(currentSegment);
    }
    return segments.map((segment) => {
      const tokens = segment.split(/(\s+)/);
      const wordIndices = [];
      for (let i = 0; i < tokens.length; i++) {
        if (!/^\s*$/.test(tokens[i]) && /\p{L}/u.test(tokens[i])) {
          wordIndices.push(i);
        }
      }
      if (wordIndices.length === 0) {
        return segment;
      }
      const firstWordIdx = wordIndices[0];
      const lastWordIdx = wordIndices[wordIndices.length - 1];
      const processedTokens = tokens.map((token, i) => {
        if (/^\s*$/.test(token)) {
          return token;
        }
        const isEdge = i === firstWordIdx || i === lastWordIdx;
        return processWord(token, isEdge, exceptionsSet, preserveMixedCase);
      });
      return processedTokens.join("");
    }).join("");
  }
};

// src/styles/index.ts
var styles = [
  amaStyle
];

// main.ts
var TitleCaseConverterPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    await this.loadSettings();
    for (const style of styles) {
      this.addCommand({
        id: `convert-title-case-${style.id}`,
        name: `Convert selection to Title Case (${style.label})`,
        editorCallback: (editor) => {
          const selection = editor.getSelection();
          if (!selection) {
            new import_obsidian2.Notice("Title Case Converter: please select some text first.");
            return;
          }
          const exceptions = this.settings.exceptionsList.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
          const converted = style.convert(selection, exceptions, this.settings.preserveMixedCase);
          editor.replaceSelection(converted);
        }
      });
    }
    this.addSettingTab(new TitleCaseConverterSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
