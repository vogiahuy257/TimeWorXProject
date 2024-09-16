import './bootstrap';
import '../css/app.css';
import '../css/login.css';
import '../css/forgotpassword.css';
import '../css/resetpassword.css';
import '../css/dashboard.css';
import '../css/edit.css'

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
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
