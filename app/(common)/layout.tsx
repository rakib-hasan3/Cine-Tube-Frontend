import Footer from "@/components/Footer";
import TanstackProvider from "@/components/providers/TanstackProvider";


export default function CommonLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TanstackProvider>
                {children}
            </TanstackProvider>            <Footer />
        </>
    );
}