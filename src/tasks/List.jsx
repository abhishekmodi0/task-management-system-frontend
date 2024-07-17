import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { taskActions } from '_store';

export { List };

function List() {
    const tasks = useSelector(x => x.tasks.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(taskActions.getAll());
    }, []);

    return (
        <div>
            <h1>Your Tasks</h1>
            <Link to="create" className="btn btn-sm btn-success mb-2">Add Task</Link>
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
                    {tasks?.value?.map(task =>
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.due_date}</td>
                            <td>{task.status === 0 ? "Not Started" : task.status === 1 ? "In Progress" : "Completed"  }</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${task.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                <button onClick={() => dispatch(taskActions.delete(task.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={task.isDeleting}>
                                    {task.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
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
        </div>
    );
}