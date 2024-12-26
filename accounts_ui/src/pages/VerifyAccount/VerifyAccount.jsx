import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '~/services/authService';

function VerifyAccount() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { email, token } = Object.fromEntries([...searchParams]);
    console.log('🚀 ~ VerifyAccount ~ token:', token);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        authService.verifyAccount({ email, token }).then((res) => setVerified(true));
    }, [email, navigate, token]);

    return <div>VerifyAccount</div>;
}

export default VerifyAccount;
