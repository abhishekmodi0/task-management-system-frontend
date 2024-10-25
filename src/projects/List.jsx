import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Pagination from '_components/Pagination';
import { projectActions } from '_store';

export { List };

function List() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin } = useSelector(x => x.auth);
    const projects = useSelector(x => x.project.list);    
    const pageLength = 5;
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageLength;
        const lastPageIndex = firstPageIndex + pageLength;
        return projects?.value?.slice(firstPageIndex, lastPageIndex);
    });
    
    useEffect(() => {
        dispatch(projectActions.getAll());
    }, []);
    
    return (
        <div>
            <h1>Projects</h1>
            {isAdmin && <Link to="create" className="float-end btn btn-sm btn-success mb-2">Add Project</Link>}
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
                    {(currentTableData || []).map(p =>
                        <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{p.description}</td>
                            <td>{p.completionDate}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${p.id}/tasks`} className="btn btn-sm btn-primary me-1">Tasks</Link>
                                {isAdmin && <>
                                    <Link to={`edit/${p.id}`} className="btn btn-sm btn-warning me-1">Edit</Link>
                                    <button onClick={() => dispatch(projectActions.delete(p.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={p.isDeleting}>
                                        {p.isDeleting 
                                            ? <span className="spinner-border spinner-border-sm"></span>
                                            : <span>Delete</span>
                                        }
                                    </button>
                                </>}
                            </td>
                        </tr>
                    )}
                    {projects?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            {(projects?.value && projects?.value.length > 0) ? <Pagination
                currentPage={currentPage}
                totalCount={projects.value?.length}
                pageSize={pageLength}
                onPageChange={page => setCurrentPage(page)}
            />: ''}
        </div>
    );
}
