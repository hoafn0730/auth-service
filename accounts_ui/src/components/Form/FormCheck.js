import classnames from 'classnames/bind';

import styles from './Form.module.scss';

const cx = classnames.bind(styles);

function FormCheck({ name, label }) {
    return (
        <div className={cx('check')}>
            <input type={'checkbox'} name={name} className={cx('check-input')} />
            {label && <label className={cx('check-label')}>{label}</label>}
        </div>
    );
}

export default FormCheck;
