import Header from "../components/Header";
import Footer from "../components/Footer";
function NotFound() {
    return (
        <>
            <Header />
            <main className="dashboard">
                <div className="container py-4">
                    <div> Not Found !</div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default NotFound;