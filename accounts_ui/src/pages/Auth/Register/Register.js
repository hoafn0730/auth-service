import React from 'react';
import Auth from '../Auth';
import { useState } from 'react';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Form from '~/components/Form';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Register.module.scss';

const cx = classNames.bind(styles);

function Register() {
    const [formValue, setFormValue] = useState({ email: '', username: '', password: '', repeatPassword: '' });
    const [searchParams] = useSearchParams();

    const handleChangeFormValue = (e) => {
        setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                process.env.REACT_APP_BACKEND_SSO_LOGIN +
                    '/auth/signup?serviceURL=' +
                    encodeURIComponent(searchParams.get('serviceURL')),
                {
                    email: formValue.email,
                    username: formValue.username,
                    password: formValue.password,
                    repeatPassword: formValue.password,
                },
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
        <Auth>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label label={'Email'} />
                    <Form.Control
                        value={formValue.email}
                        name={'email'}
                        placeholder={'Email'}
                        onChange={handleChangeFormValue}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Tên tài khoản'} />
                    <Form.Control
                        value={formValue.username}
                        name={'username'}
                        placeholder={'Tên tài khoản'}
                        onChange={handleChangeFormValue}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Mật khẩu'} />
                    <Form.Control
                        value={formValue.password}
                        name={'password'}
                        placeholder={'Mật khẩu'}
                        onChange={handleChangeFormValue}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Nhập lại mật khẩu'} />
                    <Form.Control
                        value={formValue.repeatPassword}
                        name={'repeatPassword'}
                        placeholder={'Nhập lại mật khẩu'}
                        invalid={
                            formValue.password !== formValue.repeatPassword && { message: 'Bạn nhập lại sai mật khẩu' }
                        }
                        onChange={handleChangeFormValue}
                    />
                </Form.Group>

                <Button
                    primary
                    rounded
                    disabled={
                        !formValue.email ||
                        !formValue.username ||
                        !formValue.password ||
                        !formValue.repeatPassword ||
                        formValue.password !== formValue.repeatPassword
                    }
                    className={cx('submitBtn')}
                >
                    Đăng ký
                </Button>
            </Form>
            <p className={cx('haveAcc')}>
                Bạn đã có tài khoản?{' '}
                <Link to={'/login?serviceURL=' + encodeURIComponent(searchParams.get('serviceURL'))}>Đăng nhập</Link>
            </p>
        </Auth>
    );
}

export default Register;
