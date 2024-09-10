import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { useState } from 'react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <section id="login"  className="reset-password">
                <div className="block">
                    <form onSubmit={submit}>
                        <div
                            className={`block-element ${
                                data.email ? "focused" : ""
                            }`}
                            data-label="Email"
                        >
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="input"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div
                            className={`block-element ${
                                data.password ? "focused" : ""
                            }`}
                            data-label="Password"
                        >
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="input"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <span
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                            >
                                <i className="material-icons">
                                    {showPassword
                                        ? "visibility_off"
                                        : "visibility"}
                                </i>
                            </span>

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div
                            className={`block-element ${
                                data.password_confirmation ? "focused" : ""
                            }`}
                            data-label="password confirmation"
                        >
                            <TextInput
                                id="password_confirmation"
                                type={
                                    showPasswordConfirmation
                                        ? "text"
                                        : "password"
                                }
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="input"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={togglePasswordConfirmationVisibility}
                            >
                                <i className="material-icons">
                                    {showPasswordConfirmation
                                        ? "visibility_off"
                                        : "visibility"}
                                </i>
                            </span>

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="block-button">
                            <PrimaryButton
                                className="button"
                                disabled={processing}
                            >
                                Reset Password
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </section>
        </GuestLayout>
    );
}
