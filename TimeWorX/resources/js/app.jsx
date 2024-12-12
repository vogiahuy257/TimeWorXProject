import './bootstrap';
import '../css/app.css';
import '../css/dashboard.css';
import '../css/edit.css';
import '../css/dashboard-project.css';
import '../css/dashboard-project-view.css';
import '../css/dashboard-home.css';
import '../css/dashboard-task-reportform.css';
import '../css/dashboard-project-showReportToTask.css';
import '../css/dashboard-project-analysis.css';
import '../css/dashboard-report.css';
import '../css/dashboard-calendar.css';
import '../css/welcome.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';


createInertiaApp({
    title: (title) => `${appName} - ${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
        <App {...props} />
        );
    },
    progress: {
        color: '#4B5563',
    },
});
