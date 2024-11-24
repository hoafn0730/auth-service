import classnames from 'classnames/bind';
import { faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Auth.module.scss';
import { Link, useLocation } from 'react-router-dom';

const cx = classnames.bind(styles);

function Auth({ children }) {
    const location = useLocation();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <FontAwesomeIcon icon={faCircleNodes} className={cx('logo')} />
                        <h1 className={cx('title')}>{location.pathname === '/register' ? 'Đăng ký' : 'Đăng nhập'}</h1>
                        <p className={cx('desc')}>
                            Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung có thể sẽ bị
                            khóa.
                        </p>
                    </div>
                    <div className={cx('body')}>
                        <div className={cx('formBody')}>
                            {children}

                            <div className={cx('acceptTerm')}>
                                Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với{' '}
                                <Link to="https://fullstack.edu.vn/terms" target="_top">
                                    điều khoản sử dụng
                                </Link>{' '}
                                của chúng tôi.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
