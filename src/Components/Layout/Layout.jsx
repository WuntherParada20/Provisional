import Header from '../Header/Header';
import styles from './Layout.module.css';

const Layout = ({headerState, children}) => {

    return (
        <section className={styles['main-container']}>
            <header className='sticky-top'>
                <Header />
            </header>
            <main className={styles['main']}>
                {children}
            </main>
        </section>
    );
}

export default Layout;
