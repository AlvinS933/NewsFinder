import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useFetch from './useFetch';
import { useLanguage } from './LanguageContext';

const formatDate = (iso, language) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

const hostOf = (link) => {
    try {
        return new URL(link).hostname.replace(/^www\./, '');
    } catch {
        return link;
    }
};

const BlogDetails = () => {
    const { language, t } = useLanguage();
    const {id} = useParams();
    const {data:blog, error, isPending} = useFetch('http://localhost:8000/blogs/' + id);
    const history = useHistory();
    const [progress, setProgress] = useState(0);

    // Reading progress bar: recompute on scroll, and once the article renders
    // (page height changes when the body arrives).
    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [blog]);

    const handleDelete = () => {
        fetch('http://localhost:8000/blogs/' + id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
            console.log('blog deleted');
        })
    }

    const paragraphs = (blog?.body || '')
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

    const readingTime = Math.max(1, Math.round((blog?.body || '').split(/\s+/).length / 200));

    return (
        <div className="article-page">
            <div className="reading-progress" style={{ width: `${progress}%` }} />

            <button className="article-back" onClick={() => history.push('/')}>
                <span className="article-back-arrow">←</span>{t('back')}
            </button>

            {isPending && (
                <div className="article article-skeleton">
                    <div className="skeleton-line skeleton-meta" />
                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line skeleton-title short" />
                    <div className="skeleton-line skeleton-lede" />
                    <div className="skeleton-body">
                        <div className="skeleton-line" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line short" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line short" />
                    </div>
                </div>
            )}

            {error && <div className="article-error">{error}</div>}

            {blog && (
                <article className="article">
                    <header className="article-header">
                        <div className="article-meta">
                            {blog.category && (
                                <span className={`article-chip chip-${blog.category}`}>
                                    {t(blog.category)}
                                </span>
                            )}
                            {blog.source && <span className="article-source">{blog.source}</span>}
                            {blog.date && (
                                <>
                                    <span className="article-dot" />
                                    <span>{formatDate(blog.date, language)}</span>
                                </>
                            )}
                            <span className="article-dot" />
                            <span>{readingTime} {t('minRead')}</span>
                        </div>

                        <h1 className="article-title">{blog.title}</h1>

                        {blog.description && (
                            <p className="article-standfirst">{blog.description}</p>
                        )}
                    </header>

                    <div className="article-body">
                        {paragraphs.map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>

                    <footer className="article-footer">
                        {blog.link && (
                            <a
                                className="article-origin"
                                href={blog.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="article-origin-label">{t('readOriginal')}</span>
                                <span className="article-origin-host">{hostOf(blog.link)}</span>
                                <span className="article-origin-arrow">↗</span>
                            </a>
                        )}

                        <button className="article-delete" onClick={handleDelete}>
                            {t('delete')}
                        </button>
                    </footer>
                </article>
            )}
        </div>
    );
}

export default BlogDetails;
