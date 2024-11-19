import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Pagination from '_components/Pagination';
import { taskActions } from '_store';

export { List };

function List() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin, userId } = useSelector(x => x.auth);
    const tasks = useSelector(x => x.tasks.list);
    const { projectId } = useParams();
    const pageLength = 5;

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageLength;
        const lastPageIndex = firstPageIndex + pageLength;
        return tasks?.value?.slice(firstPageIndex, lastPageIndex);
    });

    useEffect(() => {
        dispatch(taskActions.getAll(projectId));
    }, []);

    return (
        <div>
            <h1>Your Tasks</h1>
            <Link to="/project" className="btn btn-sm btn-warning mb-2 float-start" > Back to projects</Link>
            <Link to="create" className="float-end btn btn-sm btn-success mb-2">Add Task</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Title</th>
                        <th style={{ width: '30%' }}>Description</th>
                        <th style={{ width: '20%' }}>Due Date</th>
                        <th style={{ width: '20%' }}>Status</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {(currentTableData || []).map(task =>
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.status === 1 ? "Not Started" : task.status === 2 ? "In Progress" : "Completed"  }</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${task.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                {(isAdmin || task.ownedBy === userId) ? <button onClick={() => dispatch(taskActions.delete(task.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={task.isDeleting}>
                                    {task.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>: ''}
                            </td>
                        </tr>
                    )}
                    {tasks?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            {(tasks?.value && tasks?.value.length > 0) ? <Pagination
            currentPage={currentPage}
            totalCount={tasks.value?.length}
            pageSize={pageLength}
            onPageChange={page => setCurrentPage(page)}
        />: ''}
        </div>
    );
}
