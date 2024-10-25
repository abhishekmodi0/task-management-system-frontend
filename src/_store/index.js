import { configureStore } from '@reduxjs/toolkit';

import { alertReducer } from './alert.slice.js';
import { authReducer } from './auth.slice.js';
import { tasksReducer } from './tasks.slice.js';
import { projectReducer } from './projects.slice.js';

export * from './alert.slice.js';
export * from './auth.slice.js';
export * from './tasks.slice.js';
export * from './projects.slice.js';

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
        project: projectReducer,
        tasks: tasksReducer,
    },
});