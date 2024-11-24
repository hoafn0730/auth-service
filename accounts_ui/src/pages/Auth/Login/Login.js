import classnames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import styles from './Login.module.scss';
import LoginForm from './LoginForm';
import Button from '~/components/Button';
import Auth from '../Auth';

const cx = classnames.bind(styles);

function Login() {
    const [isLoginAccount, setIsLoginAccount] = useState(false);
    const [searchParams] = useSearchParams();

    const handleLogin = () => {
        const serviceURL = searchParams.get('serviceURL');

        const authURL = `${process.env.REACT_APP_BACKEND_SSO_LOGIN}/auth/google?${
            'serviceURL=' + encodeURIComponent(serviceURL)
        }${searchParams.has('popup') ? '&popup=true' : ''} `;
        if (searchParams.has('popup')) {
            const windowFeatures = 'width=1000,height=600,left=100,top=100';
            const newWindow = window.open(authURL, '_blank', windowFeatures);

            if (newWindow) {
                const checkWindowClosed = setInterval(() => {
                    if (newWindow?.closed) {
                        clearInterval(checkWindowClosed);
                        window.parent.postMessage('loginSuccess', '*');
                    }
                }, 1000);
            }
        } else {
            window.location.href = authURL;
        }
    };

    return (
        <Auth>
            {isLoginAccount && (
                <Button className={cx('back-btn')} onClick={() => setIsLoginAccount(false)}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
            )}
            {isLoginAccount ? (
                <LoginForm />
            ) : (
                <>
                    <Button
                        className={cx('login-btn')}
                        outline
                        rounded
                        startIcon={<FontAwesomeIcon icon={faUser} />}
                        onClick={() => setIsLoginAccount(true)}
                    >
                        Đăng nhập với tài khoản
                    </Button>

                    <Button
                        className={cx('login-btn')}
                        rounded
                        outline
                        startIcon={<FontAwesomeIcon icon={faGoogle} />}
                        onClick={handleLogin}
                    >
                        Đăng nhập với Google
                    </Button>
                    <Button
                        className={cx('login-btn')}
                        rounded
                        outline
                        startIcon={<FontAwesomeIcon icon={faFacebook} />}
                    >
                        Đăng nhập với Facebook
                    </Button>
                    <Button className={cx('login-btn')} rounded outline startIcon={<FontAwesomeIcon icon={faGithub} />}>
                        Đăng nhập với Github
                    </Button>
                </>
            )}
            <p className={cx('dontHaveAcc')}>
                Bạn chưa có tài khoản?{' '}
                <Link to={'/register?serviceURL=' + encodeURIComponent(searchParams.get('serviceURL'))}>Đăng ký</Link>
            </p>
            <p className={cx('forgotPassword')}>Quên mật khẩu?</p>
        </Auth>
    );
}

export default Login;
