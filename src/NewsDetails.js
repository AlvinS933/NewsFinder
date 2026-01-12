import { useHistory, useParams } from 'react-router-dom';
import useFetch from './useFetch';
import { useLanguage } from './LanguageContext';

const BlogDetails = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const {id} = useParams();
    const {data:blog, error, isPending} = useFetch('http://localhost:8000/blogs/' + id);
    const history = useHistory();
    
    const handleDelete = () => {
        fetch('http://localhost:8000/blogs/' + id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
            console.log('blog deleted');
        })
    }
    
    return ( 
        <div className="blog-details">
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {blog && (
                <article>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ margin: 0 }}>{blog.title}</h2>
                        <button onClick={() => history.push('/')} style={{ background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)', boxShadow: '0 4px 12px rgba(0, 119, 182, 0.3)' }}>{t('back')}</button>
                    </div>
                    <p>Source from: {blog.source}</p>
                    <p>Link: <a href={blog.link} target="_blank" rel="noopener noreferrer" >{blog.link}</a></p>
                    <div>{blog.body}</div>
                    
                    <button onClick={handleDelete}>{t('delete')}</button>
                </article>
            )}
        </div>
    );
}

export default BlogDetails;