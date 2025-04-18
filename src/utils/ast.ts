import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { JSXElement } from '@babel/types';

export function findFitJsxElement(code: string, offset: number): JSXElement | null {
	let element: JSXElement | null = null;// use [] due to jsx opening element nested in other elements

	// Temporarily "fix" the code by removing the `/` at the offset
	const fixedCode = code.slice(0, offset) + code.slice(offset + 1);

	try {
		const ast = parse(fixedCode, {
			sourceType: 'module',
			plugins: ['jsx', 'typescript'],
		});

		traverse(ast, {
			JSXOpeningElement(path) {
				const { node, parent } = path;
				const { start, end } = node.loc!;

				if (node.selfClosing) { // only consider not self closing jsx element
					return;
				}

				// check if the chars from offset to end has not other attributes
				const chars = fixedCode.slice(offset, end.index).trim();

				if (chars !== '>') {
					return;
				}

				if (parent.type === 'JSXElement') {
					if (parent.children.length > 1) {
						return;
					} else if (parent.children.length === 1) {
						const [child] = parent.children;
						if (child && child.type === 'JSXText') {
							const text = child.value.trim();
							if (text.length > 0) {
								return;
							}
						}
					}
				}

				if (start.index <= offset && end.index >= offset) {
					element = path.parent as JSXElement;
					path.stop();
				}
			},
		});
	} catch (error) {
		console.error('Error parsing code:', error);
	}

	return element;
}
