import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { projectActions } from '_store';
import Pagination from '_components/Pagination';

export { Home };

function Home() {
    const dispatch = useDispatch();
    const auth = useSelector(x => x.auth.value[0]?.user);
    const { isAdmin } = useSelector(x => x.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageTask, setCurrentPageTask] = useState(1);
    const pageLength = 3;
    const dashboard = useSelector(x => x.project?.dashboard);

        const currentTableDataProjects = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageLength;
        const lastPageIndex = firstPageIndex + pageLength;
        return dashboard?.projects?.slice(firstPageIndex, lastPageIndex);
    });

    const currentTableDataTasks = useMemo(() => {
        const firstPageIndex = (currentPageTask - 1) * pageLength;
        const lastPageIndex = firstPageIndex + pageLength;
        return dashboard?.tasks?.slice(firstPageIndex, lastPageIndex);
    });

    useEffect(() => {
        dispatch(projectActions.getDashboard());
    }, []);
    return (
        <>
        <div>
            <h1>Hi {`${auth?.firstName} ${auth?.lastName}` }!</h1>
            <p>You're logged in now and ready to manage your work!</p>
        </div>
        <div>
            <h3>Projects due in next two days</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Title</th>
                        <th style={{ width: '30%' }}>Description</th>
                        <th style={{ width: '20%' }}>Due Date</th>
                        <th style={{ width: '10%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentTableDataProjects || [])?.map((p, i) =>
                        <tr key={i + p.title}>
                            <td>{p.title}</td>
                            <td>{p.description}</td>
                            <td>{p.completionDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                {isAdmin ? <Link to={`project/edit/${p.id}`} className="btn btn-sm btn-primary me-1">Open Project</Link>: <Link to={`project/${p.id}/tasksconst [currentPage, setCurrentPage] = useState(1);
const [recordsPerPage] = useState(5);`} className="btn btn-sm btn-primary me-1">Open Project</Link> }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {(dashboard?.projects && dashboard?.projects.length > 0) ? <Pagination
                currentPage={currentPage}
                totalCount={dashboard.projects?.length}
                pageSize={pageLength}
                onPageChange={page => setCurrentPage(page)}
            />: ''}
        </div>
        <br/>
        <div>
            <h3>Tasks due in next two days</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Title</th>
                        <th style={{ width: '30%' }}>Project Title</th>
                        <th style={{ width: '20%' }}>Due Date</th>
                        <th style={{ width: '10%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentTableDataTasks|| [])?.map((p, i) =>
                        <tr key={p.title+i}>
                            <td>{p.title}</td>
                            <td>{p.projectTitle}</td>
                            <td>{p.dueDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`project/${p.projectId}/tasks/edit/${p.id}`} className="btn btn-sm btn-primary me-1">Open Task</Link>
                                
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {(dashboard?.tasks && dashboard?.tasks?.length > 0) ? <Pagination
                currentPage={currentPageTask}
                totalCount={dashboard?.tasks?.length}
                pageSize={pageLength}
                onPageChange={page => setCurrentPageTask(page)}
            />: ''}
        </div>
        </>
    );
}
