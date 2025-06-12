import Header from "./components/Header";
import Footer from "./components/Footer";
import MealLogger from "./components/MealLogger";
import WorkoutLogger from "./components/WorkoutLogger";
import Achievements from "./components/Achievements";
import DateNav from "./components/DateNavigator";

function App() {
  return (
    <>
      <Header />
      <main className="dashboard">
        <MealLogger />
        <WorkoutLogger />
        <Achievements />
      </main>
      <Footer />
    </>
  );
}

export default App;
