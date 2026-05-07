import Header from 'src/app/(landing)/layout/Header';
import Footer from '@/components/layout/Footer'

export default function LandingLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Header/>
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                    {children}
                </main>

                <Footer/>
            </div>
        </>
    );
}
