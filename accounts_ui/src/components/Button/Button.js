import classnames from 'classnames/bind';

import styles from './Button.module.scss';

const cx = classnames.bind(styles);

function Button({
    children,
    className,
    primary,
    outline,
    rounded,
    disabled,
    startIcon,
    endIcon,
    onClick,
    ...passProps
}) {
    let Comp = 'button';

    const props = {
        onClick,
        ...passProps,
    };

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    const classes = cx('wrapper', {
        primary,
        rounded,
        outline,
        disabled,
        [className]: className,
    });

    return (
        <Comp className={classes} {...props}>
            {startIcon && <span className={cx('icon')}>{startIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {endIcon && <span className={cx('icon')}>{endIcon}</span>}
        </Comp>
    );
}

export default Button;
