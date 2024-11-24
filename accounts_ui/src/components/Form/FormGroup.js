import classnames from 'classnames/bind';

import styles from './Form.module.scss';

const cx = classnames.bind(styles);

function FormGroup({ children, className, style, ...props }) {
    return (
        <div
            className={cx('group', {
                [className]: className,
            })}
            style={style}
        >
            {children}
        </div>
    );
}

export default FormGroup;
