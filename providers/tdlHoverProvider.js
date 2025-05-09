const vscode = require('vscode');

class TdlHoverProvider {
  provideHover(document, position, token) {
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
    
    const hoverText = new vscode.MarkdownString();
    hoverText.appendMarkdown(`**Go to ${type} definition**\n\n`);
    hoverText.appendMarkdown(`Click to navigate to \`[${type} : ${name}]\``);
    
    return new vscode.Hover(hoverText, range);
  }
}

module.exports = TdlHoverProvider;