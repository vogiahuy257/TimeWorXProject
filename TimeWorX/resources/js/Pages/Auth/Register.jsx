import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
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
            <Head title="Register" />
            <section id="login" className="resgister">
                <div className="block">
                    <div className="block-text">
                        <h1>Register</h1>
                    </div>
                    <form onSubmit={submit}>
                        <div
                            className={`block-element ${
                                data.name ? "focused" : ""
                            }`}
                            data-label="Username"
                        >
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="input"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

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
                                required
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
                            data-label="password"
                        >
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="input"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
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
                                Register
                            </PrimaryButton>

                            <div className="block-button-text">
                                <p>
                                    You already have an account?
                                    <Link href={route("login")} className="m-2">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </GuestLayout>
    );
}
