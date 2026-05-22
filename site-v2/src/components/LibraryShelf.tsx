import { BookOpen, LibraryBig, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookCardModel } from '../lib/catalog';

type Props = {
  books: BookCardModel[];
  tags: string[];
};

function matchesBook(book: BookCardModel, query: string, selectedTag: string) {
  const normalized = query.trim().toLowerCase();
  const tagMatched = selectedTag === 'all' || book.tags.includes(selectedTag);
  if (!normalized) return tagMatched;

  const haystack = [
    book.title,
    book.subtitle,
    book.description,
    book.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase();

  return tagMatched && haystack.includes(normalized);
}

export default function LibraryShelf({ books, tags }: Props) {
  const [selectedTag, setSelectedTag] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedTag(params.get('tag') || 'all');
    setQuery(params.get('q') || '');
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTag === 'all') params.delete('tag');
    else params.set('tag', selectedTag);

    if (query.trim()) params.set('q', query.trim());
    else params.delete('q');

    const next = params.toString();
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [selectedTag, query]);

  const visibleBooks = useMemo(
    () => books.filter((book) => matchesBook(book, query, selectedTag)),
    [books, query, selectedTag],
  );

  return (
    <section className="library-stage" aria-label="知识图书馆">
      <div className="search-panel">
        <div className="search-control">
          <Search aria-hidden="true" />
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索书名、简介、标签"
            aria-label="搜索书籍"
          />
        </div>
        <div className="result-count">
          {visibleBooks.length} / {books.length} 本书
        </div>
      </div>

      <div className="tag-rail" aria-label="标签筛选">
        <button
          className="tag-button"
          type="button"
          aria-pressed={selectedTag === 'all'}
          onClick={() => setSelectedTag('all')}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            className="tag-button"
            type="button"
            aria-pressed={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
            key={tag}
          >
            {tag}
          </button>
        ))}
      </div>

      {visibleBooks.length > 0 ? (
        <div className="shelf-grid">
          {visibleBooks.map((book) => (
            <a className="book-card" href={`/books/${book.slug}/`} key={book.slug}>
              <div className={`book-cover variant-${book.variant}`}>
                {book.coverImage ? <img src={book.coverImage} alt="" loading="lazy" /> : null}
                <div className="book-cover-text">
                  <span className="book-cover-initial">{book.title.slice(0, 1).toUpperCase()}</span>
                  <span className="book-cover-label">{book.title}</span>
                </div>
              </div>
              <div className="book-card-body">
                <div className="book-meta">
                  <div className="book-title-row">
                    <h2 className="book-title">{book.title}</h2>
                    {book.status === 'planned' ? <span className="status-pill">规划中</span> : null}
                  </div>
                  <p className="book-subtitle">{book.subtitle}</p>
                  <p className="book-description">{book.description}</p>
                </div>
                <div className="book-card-footer">
                  <div className="mini-tags">
                    {book.tags.slice(0, 3).map((tag) => (
                      <span className="mini-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="small-muted">
                    {book.chapterCount} 章 · {book.updated}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <LibraryBig size={24} aria-hidden="true" />
          <p>没有匹配的书籍。</p>
        </div>
      )}

      <a className="text-link" href="/search/">
        <BookOpen size={16} aria-hidden="true" /> 查看站内搜索
      </a>
    </section>
  );
}
