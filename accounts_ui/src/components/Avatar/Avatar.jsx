import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './Avatar.module.scss';
import Image from '../Image';
import images from '~/assets/images';

const cx = classnames.bind(styles);

function Avatar({ src, alt, size, style }) {
    return (
        <div className={cx('wrapper')} style={style}>
            <Image className={cx('img')} src={src} alt={alt} fallback={images.fallbackUser} />
        </div>
    );
}

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    style: PropTypes.object,
};

export default Avatar;
