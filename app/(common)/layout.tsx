import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TanstackProvider from "@/components/providers/TanstackProvider";


export default function CommonLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <TanstackProvider>
                {children}
            </TanstackProvider>            <Footer />
        </>
    );
}