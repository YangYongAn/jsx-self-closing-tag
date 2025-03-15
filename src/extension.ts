// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidChangeTextDocument(handleTextChange);
}

function handleTextChange(event: vscode.TextDocumentChangeEvent) {
	const { document, contentChanges } = event;
	for (const change of contentChanges) {
		const { text, range } = change;
	
		if(text==='/'){
			// 查看光标后面的第一个非空字符是什么
			const afterSlashPosition = new vscode.Position(range.end.line, range.end.character + 1);
			const afterText = getFirstNonWhitespaceChar(afterSlashPosition, document);

			if(afterText==='>'){
				// TODO 继续处理逻辑
				console.log('这是应该要开始处理的');
			}else{
				console.log('不必理会');
			}
		}
	}
}


/**
 * 获取指定位置后的第一个非空白字符
 * @param position 起始位置
 * @param document 文档对象
 * @returns 第一个非空白字符，如果没找到则返回空字符串
 */
function getFirstNonWhitespaceChar(position: vscode.Position, document: vscode.TextDocument): string {
	// 从当前行开始遍历
	for (let lineIndex = position.line; lineIndex < document.lineCount; lineIndex++) {
		const line = document.lineAt(lineIndex);
		let startChar = lineIndex === position.line ? position.character : 0;
		const text = line.text.substring(startChar);
		
		// 如果当前行trim后有内容
		if (text.trim()) {
			const match = text.match(/[^\s]/);
			if (match) {
				return match[0];
			}
		}
	}
	return '';
}

// This method is called when your extension is deactivated
export function deactivate() { }
