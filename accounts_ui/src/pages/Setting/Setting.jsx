import classnames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet, useLocation } from 'react-router-dom';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';

import styles from './Setting.module.scss';
import Sidebar from './Sidebar';

const cx = classnames.bind(styles);

const pages = [
    { title: 'Cài đặt tài khoản', to: 'personal', icon: <FontAwesomeIcon className={cx('icon')} icon={faUser} /> },
    { title: 'Bảo mật', to: 'security', icon: <FontAwesomeIcon className={cx('icon')} icon={faShieldHalved} /> },
];

function Setting() {
    const location = useLocation();
    const [page, setPage] = useState();

    useEffect(() => {
        const currentRoute = location.pathname.split('/')[location.pathname.split('/').length - 1];
        setPage(currentRoute);
    }, [location.pathname]);

    return (
        <div className={cx('wrapper')}>
            <Sidebar pages={pages} />
            <Outlet context={{ page }} />
        </div>
    );
}

export default Setting;
