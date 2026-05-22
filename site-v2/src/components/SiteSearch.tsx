import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { SearchItem } from '../lib/catalog';

type Props = {
  items: SearchItem[];
};

export default function SiteSearch({ items }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => {
      const haystack = [item.title, item.book, item.summary, item.tags.join(' ')]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [items, query]);

  return (
    <section className="library-stage" aria-label="站内搜索">
      <div className="search-panel">
        <div className="search-control">
          <Search aria-hidden="true" />
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索书籍、章节、标签"
            aria-label="搜索站内内容"
          />
        </div>
        <div className="result-count">{results.length} 条结果</div>
      </div>

      <div className="search-results">
        {results.map((item) => (
          <a className="search-result" href={item.url} key={`${item.type}-${item.url}`}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="book-card-footer">
              <span className="small-muted">{item.type === 'book' ? '书籍' : `章节 · ${item.book}`}</span>
              <span className="mini-tags">
                {item.tags.slice(0, 3).map((tag) => (
                  <span className="mini-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
