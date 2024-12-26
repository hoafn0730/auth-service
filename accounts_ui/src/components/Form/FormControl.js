import classnames from 'classnames/bind';
import { forwardRef } from 'react';
import styles from './Form.module.scss';

const cx = classnames.bind(styles);

function FormControl({ type, placeholder, error, ...props }, ref) {
    return (
        <>
            <input ref={ref} className={cx('control')} type={type} placeholder={placeholder} {...props} />
            {error && <div className={cx('message')}>{error.message}</div>}
        </>
    );
}

export default forwardRef(FormControl);
