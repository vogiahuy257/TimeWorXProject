import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import React from "react";
import { Link, Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <main id='Edit'>
            <Head title="Profile" />
            <div className="box relative sm:p-8 bg-white rounded-lg  max-w-screen-sm mx-auto">
                <div className="block-button ">
                    <Link
                        href={route("dashboard")}
                        className="button"
                    >Back To Dashboard
                    </Link>
                </div>
                <div className="space-y-8 pb-10 pt-10">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl mx-auto"
                        />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <UpdatePasswordForm className="max-w-xl mx-auto" />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <DeleteUserForm className="max-w-xl mx-auto" />
                    </div>
                </div>
            </div>
        </main>
    );
}
