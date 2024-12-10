import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';


export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
 
            <section id='login' className='forgot-password'>
                <div className='block relative'>
                <a className="btn-back absolute -top-[46px] left-0 shadow" href="/login"  >
                    back
                </a>

                <div className="block-text">
                    <p>
                    Forgot your password? No problem. Just let us know your email address and we will email you a password
                    reset link that will allow you to choose a new one.
                    </p>
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}

                <form onSubmit={submit}>
                    <div className={`block-element ${data.email ? 'focused' : ''}`} data-label="Email">
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="input"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    </div>

                    <InputError message={errors.email} className="mt-2" />

                    <div className="block-button">
                        <PrimaryButton className="button" disabled={processing}>
                            Email Password Reset Link
                        </PrimaryButton>
                    </div>
                </form>
                </div>
            </section>
        </GuestLayout>
    );
}
