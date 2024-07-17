import { Routes, Route } from 'react-router-dom';

import { List, AddEdit } from '.';

export { TasksLayout };

function TasksLayout() {
    return (
        <div className="p-4">
            <div className="container">
                <Routes>
                    <Route index element={<List />} />
                    <Route path="create" element={<AddEdit />} />
                    <Route path="edit/:id" element={<AddEdit />} />
                </Routes>
            </div>
        </div>
    );
}