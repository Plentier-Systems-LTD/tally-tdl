const vscode = require('vscode');

class TdlDefinitionProvider {
  provideDefinition(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /(Report|Form|Part|Line|Field)\s*:\s*(.*)/);
    if (!range) {
      return null;
    }

    const lineText = document.lineAt(position.line).text;
    const match = lineText.match(/^(Report|Form|Part|Line|Field)\s*:\s*(.*)$/);
    if (!match) {
      return null;
    }

    const type = match[1];
    const name = match[2].trim();
    const definitionPattern = new RegExp(`\\[${type}\\s*:\\s*${name}\\]`);

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      if (definitionPattern.test(line.text)) {
        const definitionPos = new vscode.Position(i, line.text.indexOf(`[${type}`));
        return new vscode.Location(document.uri, definitionPos);
      }
    }

    return null;
  }
}

module.exports = TdlDefinitionProvider;