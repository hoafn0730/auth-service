import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import Button from '~/components/Button';
import Form from '~/components/Form';
import styles from './Login.module.scss';
import authService from '~/services/authService';
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE,
} from '~/utils/validators';
const cx = classNames.bind(styles);

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [searchParams] = useSearchParams();
    const { continue: serviceURL, popup } = Object.fromEntries([...searchParams]);

    const submitForm = async (data) => {
        try {
            const res = await authService.login(
                { email: data.email, password: data.password },
                { continue: encodeURIComponent(serviceURL), popup: popup },
            );

            if (res.statusCode === 200) {
                window.location.href = serviceURL;
            }
        } catch (error) {
            console.log('🚀 ~ handleSubmit ~ error:', error);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Form.Group>
                    <Form.Label label={'Email'} />
                    <Form.Control
                        type="email"
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
                    <Form.Label label={'Password'} />
                    <Form.Control
                        type="password"
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
                <Form.Group
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Form.Check name={'remember'} type={'checkbox'} label={'Ghi nhớ đăng nhập'} />
                </Form.Group>
                <Button type="submit" primary rounded className={cx('submitBtn')}>
                    Đăng nhập
                </Button>
            </Form>
        </>
    );
}

export default LoginForm;
