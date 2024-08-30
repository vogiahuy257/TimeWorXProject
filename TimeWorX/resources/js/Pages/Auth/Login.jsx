import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false); 

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <section id='login'>
                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <div className='block'>
                    <div className="block-text">
                        <h1>Sign in</h1>
                    </div>
                    <form onSubmit={submit}>
                        <div className={`block-element ${data.email ? 'focused' : ''}`} data-label="Email">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="input"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className={`block-element ${data.email ? 'focused' : ''}`} data-label="Password">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"} // Toggle between text and password
                                    name="password"
                                    value={data.password}
                                    className="input"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <span className="toggle-password" onClick={togglePasswordVisibility}>
                                    <i className="material-icons">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </i>
                                </span>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="block-remember-me">
                            <Checkbox
                                name="remember"
                                className='remember-me check-box'
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <p>Remember me</p>
                        </div>

                        <div className="block-button">
                            <PrimaryButton className="button" disabled={processing}> Log in </PrimaryButton>
                            <h1>or</h1>
                            <div className="block-button-text">
                                <p><a href="/forgot-password" className="forgot-password-link">Forgot your password?</a></p>
                                <p>Don't have an account? <a href="/register" className="signup-link">Sign Up</a></p>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </GuestLayout>
    );
}
