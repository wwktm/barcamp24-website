import { Link } from "@remix-run/react";
import CalendarLogo from "../../images/CalendarStar.svg";
import MapPinArea from "../../images/MapPinArea.svg";

export default function EventDescription() {
  return (
    <section className="bg-gray-100 bg-gradient-to-l from-sky-100 to-orange-50 py-10 sm:pb-44">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="highlighted sm:text-7xl text-4xl font-bold mb-3">
              Show Up. Speak Up.
            </h1>
            <p className="text-lg max-w-3xl mx-auto font-medium mb-5">
              BarCamp is a community-powered unconference where the agenda is
              made by the people, for the people. You can speak, listen, debate,
              or just explore new ideas. All you need to do is show up and join
              the ride.
            </p>
            <div className="my-3 flex justify-center">
              <Link
                to="https://eventsmo.com/en/event/barcamp-kathmandu-2025#tickets"
                target="blank"
                className="font-bold flex items-center rounded-full bg-orange-500 px-7 py-3 my-2 text-lg text-white hover:bg-orange-700   focus-visible:outline-orange-400"
              >
                <span className="me-2">
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5z" />
                  </svg>
                </span>
                Buy Tickets
              </Link>
            </div>
            <div className="mt-2 flex justify-center gap-3 text-gray-400 font-bold">
              <div className="flex justify-between items-center gap-1">
                <img
                  src={CalendarLogo}
                  className="size-5"
                  alt="Calendar Icon"
                />
                <div>
                  31<sup>st</sup> May, 2025
                </div>
              </div>
              <div className="flex justify-between items-center gap-1">
                <img src={MapPinArea} className="size-5" alt="Location Icon" />
                <div>Advanced College</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
