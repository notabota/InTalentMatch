import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import AuthGuard from "src/app/(main)/layout/AuthGuard";

export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <AuthGuard>
            <AppHeader/>
            <div className="flex min-h-screen flex-col pt-[60px]">
                <main className="flex-grow">
                    {children}
                </main>
                <Footer/>
            </div>
        </AuthGuard>
    );
}
