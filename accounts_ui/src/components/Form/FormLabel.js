import classnames from 'classnames/bind';

import styles from './Form.module.scss';

const cx = classnames.bind(styles);

function FormLabel({ label, className }) {
    return (
        <label
            className={cx('label', {
                [className]: className,
            })}
        >
            {label}
        </label>
    );
}

export default FormLabel;
