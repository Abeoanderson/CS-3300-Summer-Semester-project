import Header from "../components/Header";
import DateNav from "../components/DateNavigator";
import MealLogger from "../components/MealLogger";
import Achievements from "../components/Achievements";
import WorkoutLogger from "../components/WorkoutLogger";
import Footer from "../components/Footer";

function Home() {
    return (
        <>
            <Header />
            <main className="dashboard">
                <div className="container py-4">
                    <DateNav></DateNav>
                    <MealLogger />
                    <WorkoutLogger />
                </div>
                <Achievements />
            </main>
            <Footer />
        </>
    );
}

export default Home;