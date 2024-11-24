import { useState } from 'react';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Form from '~/components/Form';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import styles from './Login.module.scss';
const cx = classNames.bind(styles);

function LoginForm() {
    const [formValue, setFormValue] = useState({ email: '', password: '' });
    const [isError, setIsError] = useState(false);
    const [searchParams] = useSearchParams();

    const handleChangeFormValue = (e) => {
        setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFocusInput = () => {
        setIsError(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_SSO_LOGIN}/auth/login?serviceURL=${
                    searchParams.has('serviceURL') ? encodeURIComponent(searchParams.get('serviceURL')) : null
                }${searchParams.has('popup') ? '&popup=' + searchParams.get('popup') : ''}`,
                { email: formValue.email, password: formValue.password },
                { withCredentials: true },
            );

            if (res.data.statusCode === 200) {
                window.location.href = searchParams.get('serviceURL');
            }
        } catch (error) {
            console.log('🚀 ~ handleSubmit ~ error:', error);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label label={'Tên đăng nhập'} />
                    <Form.Control
                        value={formValue.email}
                        name={'email'}
                        placeholder={'Email'}
                        invalid={!formValue.email && isError && { message: 'Không được để trống!' }}
                        onChange={handleChangeFormValue}
                        onFocus={handleFocusInput}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Mật khẩu'} />
                    <Form.Control
                        value={formValue.password}
                        name={'password'}
                        placeholder={'Mật khẩu'}
                        invalid={!formValue.email && isError && { message: 'Không được để trống!' }}
                        onFocus={handleFocusInput}
                        onChange={handleChangeFormValue}
                    />
                </Form.Group>
                <Form.Group
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Form.Check name={'remember'} type={'checkbox'} label={'Ghi nhớ đăng nhập'} />
                </Form.Group>
                <Button primary rounded className={cx('submitBtn')}>
                    Đăng nhập
                </Button>
            </Form>
        </>
    );
}

export default LoginForm;
