import classnames from 'classnames/bind';

import styles from './FieldGroup.module.scss';

const cx = classnames.bind(styles);

function FieldGroup({ title, children }) {
    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('heading')}>{title}</h2>
            {children}
        </div>
    );
}

export default FieldGroup;
