import { useSelector } from 'react-redux';

import FieldGroup from '~/components/FieldGroup';
import Field from '~/components/Field';
import PhotoField from '~/components/PhotoField';
import InputField from '~/components/InputField';

function Personal() {
    const { userInfo } = useSelector((state) => state.user);

    return (
        <FieldGroup title={'Info details'}>
            <Field>
                <InputField
                    label={'Display name'}
                    name={'fullName'}
                    placeholder={'Display name'}
                    desc={'Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn.'}
                />
            </Field>
            <Field>
                <InputField
                    label={'Username'}
                    name={'username'}
                    placeholder={'Username'}
                    desc={
                        'Tên của bạn xuất hiện trên trang cá nhân: ' + window.location.origin + '/@' + userInfo.username
                    }
                />
            </Field>
            <Field>
                <PhotoField
                    label={'Avatar'}
                    name={'fullName'}
                    value={userInfo?.avatar}
                    placeholder={'Họ tên'}
                    desc={'Nên là ảnh vuông, chấp nhận các tệp: JPG, PNG hoặc GIF.'}
                />
            </Field>
        </FieldGroup>
    );
}

export default Personal;
