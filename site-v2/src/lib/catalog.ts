import type { CollectionEntry } from 'astro:content';

export type BookEntry = CollectionEntry<'books'>;
export type ChapterEntry = CollectionEntry<'chapters'>;

export type BookCardModel = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: 'active' | 'planned';
  chapterCount: number;
  updated: string;
  coverImage?: string;
  variant: 'green' | 'brick' | 'brass' | 'blue';
};

export type SearchItem = {
  type: 'book' | 'chapter';
  title: string;
  url: string;
  book: string;
  summary: string;
  tags: string[];
};

const coverVariants: BookCardModel['variant'][] = ['green', 'brick', 'brass', 'blue'];

export function sortBooks(books: BookEntry[]) {
  return [...books].sort((a, b) => {
    return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'zh-CN');
  });
}

export function sortChapters(chapters: ChapterEntry[], book?: BookEntry) {
  const sectionOrder = new Map(book?.data.sections.map((section) => [section.id, section.order]) ?? []);

  return [...chapters].sort((a, b) => {
    const sectionDiff = (sectionOrder.get(a.data.section) ?? 999) - (sectionOrder.get(b.data.section) ?? 999);
    return sectionDiff || a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'zh-CN');
  });
}

export function formatDate(value?: Date) {
  if (!value) return '待更新';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
}

export function latestChapterDate(chapters: ChapterEntry[]) {
  return chapters.reduce<Date | undefined>((latest, chapter) => {
    const current = chapter.data.updated ?? chapter.data.date;
    if (!latest || current > latest) return current;
    return latest;
  }, undefined);
}

export function makeBookCards(books: BookEntry[], chapters: ChapterEntry[]): BookCardModel[] {
  return sortBooks(books).map((book, index) => {
    const bookChapters = chapters.filter((chapter) => chapter.data.book === book.data.slug && !chapter.data.draft);
    return {
      slug: book.data.slug,
      title: book.data.title,
      subtitle: book.data.subtitle,
      description: book.data.description,
      tags: book.data.tags,
      status: book.data.status,
      chapterCount: bookChapters.length,
      updated: formatDate(latestChapterDate(bookChapters)),
      coverImage: book.data.coverImage,
      variant: coverVariants[index % coverVariants.length],
    };
  });
}

export function uniqueTags(books: BookEntry[], chapters: ChapterEntry[] = []) {
  const tags = new Set<string>();
  for (const book of books) {
    for (const tag of book.data.tags) tags.add(tag);
  }
  for (const chapter of chapters) {
    for (const tag of chapter.data.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function makeSearchItems(books: BookEntry[], chapters: ChapterEntry[]): SearchItem[] {
  const bookTitleBySlug = new Map(books.map((book) => [book.data.slug, book.data.title]));
  const bookItems = sortBooks(books).map<SearchItem>((book) => ({
    type: 'book',
    title: book.data.title,
    url: `/books/${book.data.slug}/`,
    book: book.data.title,
    summary: book.data.description,
    tags: book.data.tags,
  }));

  const chapterItems = sortChapters(chapters).map<SearchItem>((chapter) => ({
    type: 'chapter',
    title: chapter.data.title,
    url: `/books/${chapter.data.book}/${chapter.data.slug}/`,
    book: bookTitleBySlug.get(chapter.data.book) ?? chapter.data.book,
    summary: chapter.data.summary,
    tags: chapter.data.tags,
  }));

  return [...bookItems, ...chapterItems];
}

export function sectionTitle(book: BookEntry, sectionId: string) {
  return book.data.sections.find((section) => section.id === sectionId)?.title ?? sectionId;
}
