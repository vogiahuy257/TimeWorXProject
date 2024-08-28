import LoginLinks from '@/app/LoginLinks'


export const metadata = {
    title: 'Laravel',
}

const Home = () => {
    return (
        <>
            <div>
                <LoginLinks />

                <h1>home</h1>
            </div>
        </>
    )
}

export default Home
