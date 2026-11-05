import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const candidates = [];
const files = [];

function collect(relative) {
  const absolute = path.join(root, relative);
  const stat = fs.statSync(absolute);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(absolute).sort()) collect(path.join(relative, name));
  } else if (/\.(ts|tsx)$/.test(relative)) files.push(relative);
}

collect('app');
collect('components');
collect('lib/ziwei/school-config.ts');

for (const relative of files) {
  const source = ts.createSourceFile(relative, fs.readFileSync(path.join(root, relative), 'utf8'), ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isJsxText(node) || ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
      || node.kind === ts.SyntaxKind.TemplateHead || node.kind === ts.SyntaxKind.TemplateMiddle || node.kind === ts.SyntaxKind.TemplateTail) {
      const text = node.text.replace(/\s+/g, ' ').trim();
      if (/\p{Script=Han}/u.test(text)) {
        const position = source.getLineAndCharacterOfPosition(node.getStart(source));
        candidates.push({ file: relative.replaceAll('\\', '/'), line: position.line + 1, kind: ts.SyntaxKind[node.kind], text });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

const output = path.join(root, 'work', 'ui-text-inventory.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({
  note: 'Ứng viên cần phân loại: không gồm comment; có thể chứa khóa nội bộ, chuỗi trùng hoặc nội dung chưa nên dịch.',
  filesScanned: files.length,
  candidates,
}, null, 2) + '\n', 'utf8');
console.log(`Đã trích xuất ${candidates.length} ứng viên từ ${files.length} tệp vào work/ui-text-inventory.json.`);
console.log('Không gọi AI; không sửa mã ứng dụng. Chỉ gửi phần liên quan cho tác vụ dịch.');
