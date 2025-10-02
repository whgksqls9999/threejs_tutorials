const fs = require('fs');
const path = require('path');

// 명령행 인수에서 장 번호 가져오기
const chapterName = process.argv[2];

if (!chapterName) {
	console.error('사용법: npm run create <장번호>');
	console.error('예시: npm run create 02장');
	process.exit(1);
}

// src 디렉토리 경로
const srcDir = path.join(__dirname, '..', 'src');
const chapterDir = path.join(srcDir, chapterName);
const jsDir = path.join(chapterDir, 'js');

// 디렉토리 생성
function createDirectories() {
	if (!fs.existsSync(chapterDir)) {
		fs.mkdirSync(chapterDir, { recursive: true });
		console.log(`✅ ${chapterName} 디렉토리 생성 완료`);
	}

	if (!fs.existsSync(jsDir)) {
		fs.mkdirSync(jsDir, { recursive: true });
		console.log(`✅ ${chapterName}/js 디렉토리 생성 완료`);
	}
}

// HTML 파일 생성
function createHTMLFile() {
	const htmlContent = `<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Chapter ${chapterName.replace('장', '')}</title>
		<style>
			body {
				margin: 0;
			}
			.back {
				position: fixed;
				left: 16px;
				top: 16px;
				z-index: 10;
				background: rgba(0, 0, 0, 0.5);
				color: #fff;
				padding: 8px 12px;
				border-radius: 6px;
				text-decoration: none;
				border: 1px solid rgba(255, 255, 255, 0.15);
				font-family: system-ui, -apple-system, Segoe UI, Roboto,
					Helvetica, Arial;
			}
		</style>
	</head>
	<body>
		<a class="back" href="../index.html">← 허브로</a>
		<script type="module" src="./js/scripts.js"></script>
	</body>
</html>`;

	const htmlPath = path.join(chapterDir, 'index.html');
	fs.writeFileSync(htmlPath, htmlContent, 'utf8');
	console.log(`✅ ${chapterName}/index.html 생성 완료`);
}

// JS 파일 생성 (빈 파일)
function createJSFile() {
	const jsPath = path.join(jsDir, 'scripts.js');
	fs.writeFileSync(jsPath, '', 'utf8');
	console.log(`✅ ${chapterName}/js/scripts.js 생성 완료`);
}

// 메인 실행 함수
function main() {
	console.log(`🚀 ${chapterName} 장 생성 시작...`);

	try {
		createDirectories();
		createHTMLFile();
		createJSFile();

		console.log(`\n🎉 ${chapterName} 장 생성이 완료되었습니다!`);
		console.log(`📁 생성된 파일들:`);
		console.log(`   - src/${chapterName}/index.html`);
		console.log(`   - src/${chapterName}/js/scripts.js`);
		console.log(`\n💡 이제 src/${chapterName} 폴더에서 작업을 시작하세요!`);
	} catch (error) {
		console.error('❌ 오류가 발생했습니다:', error.message);
		process.exit(1);
	}
}

// 스크립트 실행
main();
