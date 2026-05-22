import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const sourceRoot = path.join(root, 'source', '_posts');
const siteRoot = path.join(root, 'site-v2');
const booksDir = path.join(siteRoot, 'src', 'content', 'books');
const chaptersDir = path.join(siteRoot, 'src', 'content', 'chapters');
const assetsDir = path.join(siteRoot, 'public', 'images', 'content');

const books = {
  git: {
    slug: 'git',
    title: 'Git',
    subtitle: '版本控制与团队协作',
    description: 'Git 基础命令、分支模型、冲突处理和团队协作实践。',
    tags: ['工程化', '团队协作', '版本控制'],
    status: 'active',
    order: 10,
    sections: [
      { id: 'basics', title: '基本操作', order: 1 },
      { id: 'teamwork', title: '应用 Git 管理团队', order: 2 },
    ],
  },
  fastapi: {
    slug: 'fastapi',
    title: 'FastAPI',
    subtitle: 'Python 后端接口开发',
    description: '从路由、依赖注入、ORM 到项目结构，整理 FastAPI 后端开发常用知识。',
    tags: ['后端', 'Python', 'API'],
    status: 'active',
    order: 20,
    sections: [
      { id: 'basics', title: '基础入门', order: 1 },
      { id: 'database', title: '数据库与 ORM', order: 2 },
      { id: 'project', title: '项目实践', order: 3 },
    ],
  },
  rag: {
    slug: 'rag',
    title: 'RAG',
    subtitle: '检索增强生成',
    description: 'RAG 的离线建库、在线检索、重排序和上下文构造流程。',
    tags: ['AI', '大模型', '检索'],
    status: 'active',
    order: 30,
    sections: [
      { id: 'concept', title: '基础概念', order: 1 },
      { id: 'workflow', title: '工作流程', order: 2 },
    ],
  },
  redis: {
    slug: 'redis',
    title: 'Redis',
    subtitle: '数据结构与缓存实践',
    description: 'Redis 常用数据结构、命令和后端开发中的缓存使用场景。',
    tags: ['后端', '数据库', '缓存'],
    status: 'active',
    order: 40,
    sections: [
      { id: 'structures', title: '常用数据结构', order: 1 },
      { id: 'practice', title: '应用实践', order: 2 },
    ],
  },
  java: {
    slug: 'java',
    title: 'Java',
    subtitle: '语法、并发与工程实践',
    description: 'Java 语法、集合、并发编程、JVM 和项目实践的知识书架。',
    tags: ['Java', '后端', '并发'],
    status: 'active',
    order: 50,
    sections: [
      { id: 'syntax', title: '基本语法', order: 1 },
      { id: 'concurrency', title: '并发编程', order: 2 },
      { id: 'jvm', title: 'JVM', order: 3 },
      { id: 'project', title: '项目实践', order: 4 },
    ],
  },
  agent: {
    slug: 'agent',
    title: 'Agent',
    subtitle: '智能体概念与设计范式',
    description: '围绕 Agent 的基本概念、设计范式和实践边界整理笔记。',
    tags: ['AI', 'Agent', '大模型'],
    status: 'active',
    order: 60,
    sections: [
      { id: 'concept', title: '基础概念', order: 1 },
      { id: 'patterns', title: '设计范式', order: 2 },
    ],
  },
  'ai-companion': {
    slug: 'ai-companion',
    title: 'AI 伴侣',
    subtitle: '模型与陪伴式 AI 思考',
    description: '记录 AI 伴侣方向的模型、体验和产品思考。',
    tags: ['AI', '产品思考', '大模型'],
    status: 'active',
    order: 70,
    sections: [{ id: 'model', title: '模型', order: 1 }],
  },
  'python-backend': {
    slug: 'python-backend',
    title: 'Python 后端',
    subtitle: '数据库连接与接口实践',
    description: 'Python 后端开发中的数据库连接、接口连接和项目基础实践。',
    tags: ['后端', 'Python', '数据库'],
    status: 'active',
    order: 80,
    sections: [
      { id: 'database', title: '数据库连接', order: 1 },
      { id: 'api', title: '接口实践', order: 2 },
    ],
  },
  hot100: {
    slug: 'hot100',
    title: 'LeetCode Hot 100',
    subtitle: '算法题型整理',
    description: '按题型整理 Hot 100 中的回溯、图论等算法题。',
    tags: ['算法', 'LeetCode', '面试'],
    status: 'active',
    order: 90,
    sections: [
      { id: 'backtracking', title: '回溯', order: 1 },
      { id: 'graph', title: '图论', order: 2 },
    ],
  },
  sql50: {
    slug: 'sql50',
    title: 'SQL 50',
    subtitle: 'SQL 查询练习',
    description: 'SQL 常用工具、高级查询和连接相关练习整理。',
    tags: ['数据库', 'SQL', '面试'],
    status: 'active',
    order: 100,
    sections: [
      { id: 'tools', title: '常用工具', order: 1 },
      { id: 'advanced-query', title: '高级查询和连接', order: 2 },
    ],
  },
  interview: {
    slug: 'interview',
    title: '面经',
    subtitle: '面试复盘与表达准备',
    description: '记录面试题、面试复盘和自我表达准备。',
    tags: ['面试', '复盘', '表达'],
    status: 'active',
    order: 110,
    sections: [
      { id: 'questions', title: '面试题', order: 1 },
      { id: 'self-review', title: '自我表达', order: 2 },
      { id: 'company', title: '公司面试', order: 3 },
    ],
  },
  misc: {
    slug: 'misc',
    title: '杂记',
    subtitle: '临时笔记与未归档内容',
    description: '暂时无法归入明确知识书籍的内容，后续再拆分或归档。',
    tags: ['杂记'],
    status: 'active',
    order: 999,
    sections: [{ id: 'notes', title: '笔记', order: 1 }],
  },
};

const fileMap = new Map([
  ['hello-world.md', { book: 'misc', section: 'notes', slug: 'hello-world' }],
  ['agent/什么是agent.md', { book: 'agent', section: 'concept', slug: 'what-is-agent' }],
  ['agent/agent设计范式.md', { book: 'agent', section: 'patterns', slug: 'agent-design-patterns' }],
  ['ai伴侣/模型.md', { book: 'ai-companion', section: 'model', slug: 'model' }],
  ['FastAPI/初试FastAPI.md', { book: 'fastapi', section: 'basics', slug: 'first-fastapi' }],
  ['FastAPI/中间件和依赖注入.md', { book: 'fastapi', section: 'basics', slug: 'middleware-dependency-injection' }],
  ['FastAPI/FastAPI-DevDetails.md', { book: 'fastapi', section: 'basics', slug: 'fastapi-dev-details' }],
  ['FastAPI/在路由中使用ORM.md', { book: 'fastapi', section: 'database', slug: 'orm-in-router' }],
  ['FastAPI/ORM基本操作.md', { book: 'fastapi', section: 'database', slug: 'orm-basic' }],
  ['FastAPI/SqlAIchemy的查.md', { book: 'fastapi', section: 'database', slug: 'sqlalchemy-select' }],
  ['FastAPI/SqlAIchemy的增删改.md', { book: 'fastapi', section: 'database', slug: 'sqlalchemy-cud' }],
  ['FastAPI/头条项目/接入ORM.md', { book: 'fastapi', section: 'project', slug: 'toutiao-connect-orm' }],
  ['FastAPI/头条项目/统一构建router.md', { book: 'fastapi', section: 'project', slug: 'toutiao-router' }],
  ['FastAPI/头条项目/引入CRUD.md', { book: 'fastapi', section: 'project', slug: 'toutiao-crud' }],
  ['Git/Git基本操作.md', { book: 'git', section: 'basics', slug: 'git-basic' }],
  ['Git/管理小学期5人团队1.md', { book: 'git', section: 'teamwork', slug: 'team-workflow' }],
  ['hot100/回溯/产生括号.md', { book: 'hot100', section: 'backtracking', slug: 'generate-parentheses' }],
  ['hot100/回溯/电话号码的字母组合.md', { book: 'hot100', section: 'backtracking', slug: 'letter-combinations' }],
  ['hot100/回溯/全排列.md', { book: 'hot100', section: 'backtracking', slug: 'permutations' }],
  ['hot100/回溯/子集.md', { book: 'hot100', section: 'backtracking', slug: 'subsets' }],
  ['hot100/回溯/组合总和.md', { book: 'hot100', section: 'backtracking', slug: 'combination-sum' }],
  ['hot100/图论/Trie.md', { book: 'hot100', section: 'graph', slug: 'trie' }],
  ['java项目/新增死信队列.md', { book: 'java', section: 'project', slug: 'dead-letter-queue' }],
  ['Python后端/接口连接到DB.md', { book: 'python-backend', section: 'api', slug: 'api-connect-db' }],
  ['Python后端/python链接DB.md', { book: 'python-backend', section: 'database', slug: 'python-connect-db' }],
  ['RAG/RAG基础.md', { book: 'rag', section: 'concept', slug: 'rag-basic' }],
  ['redis/redis常用数据结构.md', { book: 'redis', section: 'structures', slug: 'redis-structures' }],
  ['sql50/sql常用工具.md', { book: 'sql50', section: 'tools', slug: 'sql-tools' }],
  ['sql50/高级查询和连接/按照分类统计薪水.md', { book: 'sql50', section: 'advanced-query', slug: 'salary-by-category' }],
  ['面经/面试.md', { book: 'interview', section: 'questions', slug: 'interview-questions' }],
  ['面经/性格缺点.md', { book: 'interview', section: 'self-review', slug: 'weaknesses' }],
  ['面经/中兴外包一面.md', { book: 'interview', section: 'company', slug: 'zte-outsourcing-first-round' }],
]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyValue) continue;

    const [, key, rawValue] = keyValue;
    if (rawValue === '') {
      const list = [];
      while (lines[index + 1]?.match(/^\s*-\s+/)) {
        index += 1;
        list.push(lines[index].replace(/^\s*-\s+/, '').trim());
      }
      data[key] = list;
    } else if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      data[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      data[key] = rawValue.replace(/^['"]|['"]$/g, '').trim();
    }
  }

  return { data, body: raw.slice(match[0].length) };
}

function yq(value) {
  return JSON.stringify(value ?? '');
}

function writeYamlList(name, values) {
  if (!values?.length) return `${name}: []`;
  return [`${name}:`, ...values.map((value) => `  - ${yq(value)}`)].join('\n');
}

function writeBook(book) {
  const lines = [
    `slug: ${yq(book.slug)}`,
    `title: ${yq(book.title)}`,
    `subtitle: ${yq(book.subtitle)}`,
    `description: ${yq(book.description)}`,
    writeYamlList('tags', book.tags),
    `status: ${yq(book.status)}`,
    `order: ${book.order}`,
    'sections:',
    ...book.sections.flatMap((section) => [
      `  - id: ${yq(section.id)}`,
      `    title: ${yq(section.title)}`,
      `    order: ${section.order}`,
    ]),
    '',
  ];

  fs.mkdirSync(booksDir, { recursive: true });
  fs.writeFileSync(path.join(booksDir, `${book.slug}.yaml`), lines.join('\n'), 'utf8');
}

function cleanMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[[^\]]+\]\([^)]+\)/g, (match) => match.match(/\[([^\]]+)\]/)?.[1] ?? '')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSummary(body, fallback) {
  const blocks = body.split(/\r?\n\r?\n/);
  const paragraph = blocks.find((block) => {
    const trimmed = block.trim();
    return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && !trimmed.startsWith('---');
  });

  const summary = cleanMarkdown(paragraph ?? body);
  if (!summary) return fallback;
  return summary.length > 95 ? `${summary.slice(0, 95)}...` : summary;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function postTags(frontmatterTags, book) {
  const genericTags = new Set(['博客', '入门']);
  const tags = Array.isArray(frontmatterTags)
    ? frontmatterTags.filter((tag) => tag && !genericTags.has(tag))
    : [];

  return unique([...tags, ...book.tags]);
}

function rewriteImageLinks(body, sourceFile, bookSlug) {
  return body.replace(/!\[([^\]]*)\]\((?!https?:\/\/|\/|#)([^)]+)\)/g, (match, alt, url) => {
    const [rawPath, suffix = ''] = url.split(/(?=[#?])/);
    const decodedPath = decodeURI(rawPath);
    const sourceAsset = path.resolve(path.dirname(sourceFile), decodedPath);
    if (!fs.existsSync(sourceAsset)) return match;

    const relativeAssetPath = toPosix(path.relative(path.join(sourceRoot, path.dirname(path.relative(sourceRoot, sourceFile))), sourceAsset));
    const cleanRelativeAssetPath = relativeAssetPath.replace(/^\.\//, '');
    const targetAsset = path.join(assetsDir, bookSlug, cleanRelativeAssetPath);
    fs.mkdirSync(path.dirname(targetAsset), { recursive: true });
    fs.copyFileSync(sourceAsset, targetAsset);

    const publicPath = `/images/content/${bookSlug}/${cleanRelativeAssetPath}`.split(path.sep).join('/');
    return `![${alt}](${encodeURI(publicPath)}${suffix})`;
  });
}

function normalizeBody(body, sourceFile, bookSlug) {
  const converted = escapeMdxComparators(rewriteImageLinks(body, sourceFile, bookSlug))
    .replace(/^```env\s*$/gm, '```ini')
    .replace(/\r\n/g, '\n')
    .trim();
  return `${converted}\n`;
}

function escapeMdxComparators(body) {
  let inFence = false;

  return body
    .split('\n')
    .map((line) => {
      if (line.trimStart().startsWith('```')) {
        inFence = !inFence;
        return line;
      }

      if (inFence) return line;

      return line.replace(/([A-Za-z0-9_])<([A-Za-z0-9_])/g, '$1 &lt; $2');
    })
    .join('\n');
}

function writeChapter(sourceFile, orderByBookSection) {
  const relative = toPosix(path.relative(sourceRoot, sourceFile));
  const mapped = fileMap.get(relative);
  if (!mapped) {
    throw new Error(`No migration mapping for ${relative}`);
  }

  const book = books[mapped.book];
  const section = book.sections.find((item) => item.id === mapped.section);
  if (!book || !section) {
    throw new Error(`Invalid book/section mapping for ${relative}`);
  }

  const raw = fs.readFileSync(sourceFile, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const orderKey = `${book.slug}:${section.id}`;
  const order = orderByBookSection.get(orderKey) ?? 1;
  orderByBookSection.set(orderKey, order + 1);

  const title = data.title || path.basename(sourceFile, '.md');
  const date = String(data.date || '2026-01-01').slice(0, 10);
  const summary = makeSummary(body, title);
  const tags = postTags(data.tags, book);
  const normalizedBody = normalizeBody(body, sourceFile, book.slug);
  const targetDir = path.join(chaptersDir, book.slug);
  const targetFile = path.join(targetDir, `${mapped.slug}.mdx`);

  const frontmatter = [
    '---',
    `title: ${yq(title)}`,
    `slug: ${yq(mapped.slug)}`,
    `book: ${yq(book.slug)}`,
    `section: ${yq(section.id)}`,
    `order: ${order}`,
    `date: ${date}`,
    `updated: ${date}`,
    writeYamlList('tags', tags),
    `summary: ${yq(summary)}`,
    'draft: false',
    '---',
    '',
  ].join('\n');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, `${frontmatter}${normalizedBody}`, 'utf8');
}

const markdownFiles = walk(sourceRoot).filter((file) => file.endsWith('.md'));
const relativeMarkdownFiles = markdownFiles.map((file) => toPosix(path.relative(sourceRoot, file)));
const unmapped = relativeMarkdownFiles.filter((file) => !fileMap.has(file));
if (unmapped.length) {
  throw new Error(`Missing mappings:\n${unmapped.join('\n')}`);
}

for (const book of Object.values(books)) {
  writeBook(book);
}

const orderByBookSection = new Map();
for (const file of markdownFiles.sort((a, b) => {
  return toPosix(path.relative(sourceRoot, a)).localeCompare(toPosix(path.relative(sourceRoot, b)), 'zh-CN');
})) {
  writeChapter(file, orderByBookSection);
}

console.log(`Migrated ${markdownFiles.length} Markdown files into ${chaptersDir}`);
