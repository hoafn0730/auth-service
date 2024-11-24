import React, { useEffect } from 'react';

function Reload() {
    useEffect(() => {
        window.close();
        window.parent.postMessage('loginSuccess', '*');
    }, []);

    return <div></div>;
}

export default Reload;
