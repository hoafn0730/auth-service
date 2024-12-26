import { useState } from 'react';
import classnames from 'classnames/bind';
import { Link, useSearchParams } from 'react-router-dom';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

import Auth from '../Auth';
import LoginForm from './LoginForm';
import styles from './Login.module.scss';
import Button from '~/components/Button';

const cx = classnames.bind(styles);

function Login() {
    const [searchParams] = useSearchParams();
    const { continue: serviceURL, popup } = Object.fromEntries([...searchParams]);
    const [isLoginAccount, setIsLoginAccount] = useState(false);

    const handleLogin = (type) => {
        const authURL = `${process.env.REACT_APP_BACKEND_SSO_URL}/auth/${type}?${
            'continue=' + encodeURIComponent(serviceURL)
        }${popup ? '&popup=true' : ''} `;
        if (popup) {
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
                        onClick={() => handleLogin('google')}
                    >
                        Đăng nhập với Google
                    </Button>
                    <Button
                        className={cx('login-btn')}
                        rounded
                        outline
                        startIcon={<FontAwesomeIcon icon={faFacebook} />}
                        onClick={() => handleLogin('facebook')}
                    >
                        Đăng nhập với Facebook
                    </Button>
                    <Button
                        className={cx('login-btn')}
                        rounded
                        outline
                        startIcon={<FontAwesomeIcon icon={faGithub} />}
                        onClick={() => handleLogin('github')}
                    >
                        Đăng nhập với Github
                    </Button>
                </>
            )}
            <p className={cx('dontHaveAcc')}>
                Bạn chưa có tài khoản? <Link to={'/register?continue=' + encodeURIComponent(serviceURL)}>Đăng ký</Link>
            </p>
            <p className={cx('forgotPassword')}>Quên mật khẩu?</p>
        </Auth>
    );
}

export default Login;
