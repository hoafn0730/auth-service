import classnames from 'classnames/bind';

import styles from './Field.module.scss';

const cx = classnames.bind(styles);

function Field({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

export default Field;
