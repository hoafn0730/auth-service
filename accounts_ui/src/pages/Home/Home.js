import { Navigate } from 'react-router-dom';
import MentionExample from '~/components/Comment';

function Home() {
    return (
        <div>
            <Navigate to={'/login'} />
            {/* <MentionExample /> */}
        </div>
    );
}

export default Home;
