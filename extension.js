const vscode = require('vscode');
const TdlDocumentSymbolProvider = require('./providers/tdlSymbolProvider');
const TdlDefinitionProvider = require('./providers/tdlDefinitionProvider');
const TdlHoverProvider = require('./providers/tdlHoverProvider');

// This method is called when your extension is activated
function activate(context) {
  console.log('TDL extension activated');

  // Register providers
  const selector = { language: 'tdl' };
  
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      selector,
      new TdlDocumentSymbolProvider()
    )
  );
  
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      selector,
      new TdlDefinitionProvider()
    )
  );
  
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      selector,
      new TdlHoverProvider()
    )
  );

  // Add text decorations for references
  const referenceDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'underline',
    cursor: 'pointer'
  });

  function updateDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'tdl') return;

    const text = editor.document.getText();
    const references = [];
    const referenceRegex = /^(Report|Form|Part|Line|Field)\s*:\s*(.*)$/gm;
    
    let match;
    while ((match = referenceRegex.exec(text))) {
      const startPos = editor.document.positionAt(match.index + match[1].length + 2);
      const endPos = editor.document.positionAt(match.index + match[0].length);
      references.push({
        range: new vscode.Range(startPos, endPos),
        hoverMessage: `Go to ${match[1]} definition`
      });
    }
    
    editor.setDecorations(referenceDecorationType, references);
  }

  // Update decorations when active editor changes
  vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions);
  vscode.workspace.onDidChangeTextDocument(updateDecorations, null, context.subscriptions);

  // Initial update
  updateDecorations();
}

// This method is called when your extension is deactivated
function deactivate() {
  console.log('TDL extension deactivated');
}

module.exports = {
  activate,
  deactivate
};