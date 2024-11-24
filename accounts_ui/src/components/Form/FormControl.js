import classnames from 'classnames/bind';

import styles from './Form.module.scss';

const cx = classnames.bind(styles);

function FormControl({ value, name, type, placeholder, invalid, onChange, onFocus, ...props }) {
    return (
        <>
            <input
                className={cx('control')}
                value={value}
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={onFocus}
                {...props}
            />
            {invalid && <div className={cx('message')}>{invalid.message}</div>}
        </>
    );
}

export default FormControl;
