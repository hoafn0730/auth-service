import classnames from 'classnames/bind';

import styles from './Form.module.scss';
import FormGroup from './FormGroup';
import FormLabel from './FormLabel';
import FormControl from './FormControl';
import FormCheck from './FormCheck';

const cx = classnames.bind(styles);

function Form({ children, method, onSubmit, ...props }) {
    return (
        <form className={cx('wrapper')} onSubmit={onSubmit} method={method} {...props}>
            {children}
        </form>
    );
}

Form.Group = FormGroup;
Form.Label = FormLabel;
Form.Control = FormControl;
Form.Check = FormCheck;

export default Form;
