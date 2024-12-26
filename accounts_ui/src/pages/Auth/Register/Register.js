import React from 'react';
import Auth from '../Auth';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Form from '~/components/Form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Register.module.scss';
import { useForm } from 'react-hook-form';
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_CONFIRMATION_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE,
} from '~/utils/validators';
import authService from '~/services/authService';

const cx = classNames.bind(styles);

function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { continue: serviceURL } = Object.fromEntries([...searchParams]);

    const submitForm = async (data) => {
        try {
            const res = await authService.signup({
                email: data.email,
                username: data.username,
                password: data.password,
                repeatPassword: data.password,
            });

            if (res.statusCode === 201) {
                navigate('/login?continue=' + serviceURL);
            }
        } catch (error) {
            console.log('🚀 ~ handleSubmit ~ error:', error);
        }
    };

    return (
        <Auth>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Form.Group>
                    <Form.Label label={'Email'} />
                    <Form.Control
                        name={'email'}
                        placeholder={'Email'}
                        error={errors['email']}
                        {...register('email', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: EMAIL_RULE,
                                message: EMAIL_RULE_MESSAGE,
                            },
                        })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Username'} />
                    <Form.Control
                        name={'username'}
                        placeholder={'Username'}
                        error={errors['username']}
                        {...register('username', {
                            required: FIELD_REQUIRED_MESSAGE,
                        })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Password'} />
                    <Form.Control
                        type={'password'}
                        name={'password'}
                        placeholder={'Password'}
                        error={errors['password']}
                        {...register('password', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                                value: PASSWORD_RULE,
                                message: PASSWORD_RULE_MESSAGE,
                            },
                        })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label label={'Repeat password'} />
                    <Form.Control
                        type={'password'}
                        name={'repeatPassword'}
                        placeholder={'Enter repeat password'}
                        error={errors['repeatPassword']}
                        {...register('repeatPassword', {
                            validate: (value) => {
                                return value === watch('password') ? true : PASSWORD_CONFIRMATION_MESSAGE;
                            },
                        })}
                    />
                </Form.Group>

                <Button type="submit" primary rounded disabled={true} className={cx('submitBtn')}>
                    Đăng ký
                </Button>
            </Form>
            <p className={cx('haveAcc')}>
                Bạn đã có tài khoản?{' '}
                <Link to={'/login?continue=' + encodeURIComponent(searchParams.get('continue'))}>Đăng nhập</Link>
            </p>
        </Auth>
    );
}

export default Register;
