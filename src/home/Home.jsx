import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export { Home };

function Home() {
    const auth = useSelector(x => x.auth.value[0]?.user);
    return (
        <div>
            <h1>Hi {`${auth?.firstName} ${auth?.lastName}` }!</h1>
            <p>You're logged in now and ready to manage your tasks!</p>
            <p><Link to="/tasks">Manage Tasks</Link></p>
        </div>
    );
}