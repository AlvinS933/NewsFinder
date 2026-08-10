import NewsList from './NewsList';
import useFetch from './useFetch';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const Home = () => {
    const { t } = useLanguage();
    const {data:blogs, isPending, error} = useFetch('http://localhost:8000/blogs');
    const [searchTerm, setSearchTerm] = useState('');
    const allNewsRef = useRef(null);
    const politicsRef = useRef(null);
    const economyRef = useRef(null);
    const technologyRef = useRef(null);
    const healthRef = useRef(null);
    const entertainmentRef = useRef(null);
    const environmentRef = useRef(null);
    const educationRef = useRef(null);
    const searchResultsRef = useRef(null);
    const offset = 100;
    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const categories = [
        { name: t('allNews'), ref: allNewsRef, filter: null },
        { name: t('politics'), ref: politicsRef, filter: 'politics' },
        { name: t('economy'), ref: economyRef, filter: 'economy' },
        { name: t('technology'), ref: technologyRef, filter: 'technology' },
        { name: t('health'), ref: healthRef, filter: 'health' },
        { name: t('entertainment'), ref: entertainmentRef, filter: 'entertainment' },
        { name: t('environment'), ref: environmentRef, filter: 'environment' },
        { name: t('education'), ref: educationRef, filter: 'education' }
    ];
    const trimmedSearch = searchTerm.trim();
    const isSearching = trimmedSearch.length > 0;
    const searchResults = blogs ? blogs.filter((blog) => blog.title.toLowerCase().includes(trimmedSearch.toLowerCase())) : [];
    // Auto-scroll to the search results section the moment a search becomes active.
    useEffect(() => {
        if (isSearching) {
            // wait a tick so the section has mounted/expanded before scrolling
            const id = setTimeout(() => scrollToSection(searchResultsRef), 50);
            return () => clearTimeout(id);
        }
    }, [isSearching]);
    return ( 
        <div className="home-container">
            <div className ="sidebar" >
                <div className = "search-container">
                    <p>Search</p>
                    <input placeholder={'Search title...'} value = {searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown = {(e) => {
                        if (e.key === 'Enter' && isSearching) {
                            scrollToSection(searchResultsRef);
                        }
                    }}/>
                </div>
                <div className="category-nav">
                    <h3>{t('categories')}</h3>
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => scrollToSection(category.ref)}
                            className="category-button"
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="home">
                {error && <div>{error}</div>}
                {isPending && <div>{t('loading')}</div>}
                {/* Search Results Section */}
                {isSearching && (
                    <div ref={searchResultsRef} style={{scrollMarginTop: `${offset}px`}}>
                        {searchResults.length > 0 ? (
                            <NewsList blogs={searchResults} title={t('searchResults')} />
                        ) : (
                            <p>{t('noSearchResults')}</p>
                        )}
                    </div>
                )}
                {/* Category Sections */}
                <div ref={allNewsRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs} title={t('allNews') + ":"} />}
                </div>
                
                <div ref={politicsRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "politics")} title={t('politicsNews')} />}
                </div>
                
                <div ref={economyRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "economy")} title={t('economyNews')} />}
                </div>
                
                <div ref={technologyRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "technology")} title={t('technologyNews')} />}
                </div>
                
                <div ref={healthRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "health")} title={t('healthNews')} />}
                </div>
                
                <div ref={entertainmentRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "entertainment")} title={t('entertainmentNews')} />}
                </div>
                
                <div ref={environmentRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "environment")} title={t('environmentNews')} />}
                </div>
                
                <div ref={educationRef} style={{scrollMarginTop: `${offset}px`}}>
                    {blogs && <NewsList blogs={blogs.filter((blog)=>blog.category === "education")} title={t('educationNews')} />}
                </div>
            </div>
        </div>
    );
}
 
export default Home;