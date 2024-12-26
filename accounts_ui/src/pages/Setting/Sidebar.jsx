import classnames from 'classnames/bind';

import styles from './Setting.module.scss';
import { NavLink } from 'react-router-dom';

const cx = classnames.bind(styles);

function Sidebar({ pages }) {
    return (
        <div className={cx('sidebar')}>
            <h1 className={cx('heading')}>Cài đặt</h1>
            <ul className={cx('sidebar-list')}>
                {pages.map((page, index) => (
                    <li key={index}>
                        <NavLink
                            to={page.to}
                            className={(nav) =>
                                cx({
                                    active: nav.isActive,
                                })
                            }
                        >
                            {page.icon}
                            <span>{page.title}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
