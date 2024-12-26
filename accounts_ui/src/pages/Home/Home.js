import { Navigate } from 'react-router-dom';

function Home() {
    return (
        <div>
            <Navigate to={'/login'} />
            {/* <MentionExample /> */}
        </div>
    );
}

export default Home;
