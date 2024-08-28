import { Nunito } from 'next/font/google'
import '@/app/ui/global.css'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body>{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
