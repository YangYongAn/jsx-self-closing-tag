// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { isJsxSupported } from './utils/lang';
import { findFitJsxElement } from './utils/ast';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.workspace.onDidChangeTextDocument(handleTextChange);
	context.subscriptions.push(disposable);
}

function handleTextChange(event: vscode.TextDocumentChangeEvent) {
	const { document, contentChanges } = event;

	for (const change of contentChanges) {
		const { text, range } = change;

		if (text === '/') {
			// check if the current document is a JSX supported environment
			if (!isJsxSupported(document, range.start)) {
				return;
			}

			const currentOffset = document.offsetAt(range.start);
			const element = findFitJsxElement(document.getText(), currentOffset);

			if (element) {
				console.log('yes there', element);

				const { closingElement } = element;
				if (closingElement && closingElement.loc) {

					const endPos = document.positionAt(closingElement.loc.end.index); // get the end position of the closing tag from loc.end.index
					const startPos = document.positionAt(currentOffset + 1); // get the start position of the closing tag from loc.start.index
					const writeRange = new vscode.Range(startPos, endPos); // create a new range object representing the current cursor position to the end position of the closing tag

					const editor = vscode.window.activeTextEditor;
					if (editor && editor.document === document) {
						editor.edit(editBuilder => editBuilder.replace(writeRange, ''), { undoStopBefore: false, undoStopAfter: false });
					}
				}

			} else {
				console.log('不必理会'); // no need to care
			}
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate');
}
