import classnames from 'classnames/bind';
import { useOutletContext } from 'react-router-dom';

import styles from '../Setting.module.scss';
import IndexModule from '~/components/IndexModule';
import Personal from './Personal';
import Security from './Security';

const cx = classnames.bind(styles);

function SettingPage() {
    const { page } = useOutletContext();

    return (
        <div className={cx('page')}>
            <IndexModule className={cx('row')}>
                <IndexModule className={cx('col', 'l-12')}>
                    {page === 'personal' && <Personal />}
                    {page === 'security' && <Security />}
                </IndexModule>
            </IndexModule>
        </div>
    );
}

export default SettingPage;
