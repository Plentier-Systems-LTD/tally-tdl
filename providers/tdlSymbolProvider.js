const vscode = require('vscode');

class TdlDocumentSymbolProvider {
  provideDocumentSymbols(document, token) {
    const symbols = [];
    const definitionRegex = /\[(Report|Form|Part|Line|Field)\s*:\s*(.*?)\]/g;
    
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      let match;
      while (match = definitionRegex.exec(line.text)) {
        const type = match[1];
        const name = match[2].trim();
        const range = new vscode.Range(
          new vscode.Position(i, match.index),
          new vscode.Position(i, match.index + match[0].length)
        );
        
        symbols.push(new vscode.DocumentSymbol(
          `${type}: ${name}`,
          '',
          this.getSymbolKind(type),
          range,
          range
        ));
      }
    }
    
    return symbols;
  }
  
  getSymbolKind(type) {
    switch (type) {
      case 'Report': return vscode.SymbolKind.Module;
      case 'Form': return vscode.SymbolKind.Class;
      case 'Part': return vscode.SymbolKind.Object;
      case 'Line': return vscode.SymbolKind.Interface;
      case 'Field': return vscode.SymbolKind.Field;
      default: return vscode.SymbolKind.Variable;
    }
  }
}

module.exports = TdlDocumentSymbolProvider;