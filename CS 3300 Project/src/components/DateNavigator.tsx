import { useState } from "react";
const current = new Date
//const { currentDate, setCurrentDate } = useState(current);

function DateNav() {
    return (
        <section className="container py-4">
            <div className="mx-auto" style={{ maxWidth: "900px" }}>
                <div className="row g-4 align-items-start">
                    <div className="col-md-12">
                        <div className="bg-light p-4 rounded shadow-sm">
                            <h2 className="text-primary mb-4">Date:</h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default DateNav;