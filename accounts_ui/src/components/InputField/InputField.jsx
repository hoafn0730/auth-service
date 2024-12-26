import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './InputField.module.scss';
import Button from '../Button';
import profileService from '~/services/profileService';

const cx = classnames.bind(styles);

function InputField({ label, name, type = 'text', placeholder, desc }) {
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState('');

    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        setValue(name === 'username' ? userInfo?.username : userInfo?.fullName);
    }, [name, userInfo]);

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleSave = () => {
        profileService.updateProfile({ fullName: value }).catch((err) => console.log(err));
        setIsEdit(false);
    };

    const handleCancel = () => {
        setIsEdit(false);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <label className={cx('label')}>{label}</label>
                <input
                    value={value}
                    name={name}
                    type={type}
                    className={cx('control')}
                    placeholder={placeholder}
                    disabled={!isEdit}
                    onChange={(e) => setValue(e.target.value)}
                />
                <p className={cx('desc')}>{desc}</p>
            </div>
            {!isEdit && (
                <Button outline rounded fieldBtn onClick={handleEdit}>
                    Edit
                </Button>
            )}

            {isEdit && (
                <div className={cx('editMode')}>
                    <Button outline rounded fieldBtn saveFieldBtn onClick={handleSave}>
                        Save
                    </Button>
                    <Button outline rounded fieldBtn onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            )}
        </>
    );
}

export default InputField;
