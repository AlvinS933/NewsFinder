import {Link} from 'react-router-dom';
import { useLanguage } from './LanguageContext';

const Navbar = () => {
    const { language, toggleLanguage, t } = useLanguage();
    
    return ( 
        <nav className="navbar">
            <h1>{t('newsCollection')}</h1>
            <div className="links">
                
                <Link to="/">{t('home')}</Link>
                <Link to="/simulator">{t('agenticSimulator')}</Link>
                <Link to="/create" className = "language-toggle-btn">{t('newPost')}</Link>
                <Link to="/search" className = "language-toggle-btn">{t('searchAdd')}</Link>
                <button 
                    onClick={toggleLanguage}
                    className="language-toggle-btn"
                    title={language === 'en' ? 'Switch to Chinese' : '切換至英文'}
                >
                    {language === 'en' ? 'Language: 中文' : 'Language: EN'}
                </button>
            </div>
        </nav>
    );
}
 
export default Navbar;