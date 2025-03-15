import * as vscode from 'vscode';

/**
 * 获取指定位置后的第一个非空白字符
 * @param position 起始位置
 * @param document 文档对象
 * @returns 第一个非空白字符，如果没找到则返回空字符串
 */
export function getFirstNonWhitespaceChar(position: vscode.Position, document: vscode.TextDocument): string {
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