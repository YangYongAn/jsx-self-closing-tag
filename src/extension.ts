// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { isJsxSupported } from './utils/lang';
import { findFitNodePath } from './utils/ast';

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
			// 检查是否在支持 JSX 的环境中
			if (!isJsxSupported(document, range.start)) {
				return;
			}

			// 判断是否处于 JSXOpeningElement 中，且是非自闭合标签的结束位置
			if (findFitNodePath(document.getText(), document.offsetAt(range.start))) {
				console.log('这是应该要开始处理的');
			} else {
				console.log('不必理会');
			}
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate');
 }
