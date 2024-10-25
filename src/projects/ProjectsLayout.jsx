import { Routes, Route } from 'react-router-dom';

import { TasksLayout } from '../tasks';
import { List, AddEdit } from '.';

export { ProjectsLayout };

function ProjectsLayout() {
    return (
        <div className="p-4">
            <div className="container">
                <Routes>
                    <Route index element={<List />} />
                    <Route path="create" element={<AddEdit />} />
                    <Route path="edit/:id" element={<AddEdit />} />
                    <Route path=":projectId/tasks/*" caseSensitive element={<TasksLayout />} />

                </Routes>
            </div>
        </div>
    );
}
