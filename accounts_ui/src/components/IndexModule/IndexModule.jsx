import classnames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './IndexModule.module.scss';

const cx = classnames.bind(styles);

function IndexModule({ children, className, ...props }) {
    const classes = cx(
        className.split(' ').reduce((prev, cur) => {
            return { ...prev, [cur]: cur };
        }, {}),
    );
    return (
        <section className={classes} {...props}>
            {children}
        </section>
    );
}

IndexModule.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
};

export default IndexModule;
