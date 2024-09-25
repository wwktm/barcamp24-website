import { Link } from "@remix-run/react";
import scheduleQr from "~/images/schedule-qr.png";
export default function Schedule() {
  return (
    <section className="event-schedule my-7 py-20">
      <div className="container">
        <div className="mx-auto max-w-4xl sm:py-10 lg:py-16 rounded-xl border-2 border-gray-300 bg-white px-6 py-6 shadow-sm hover:border-gray-300">
          <div className="text-center">
            <h2 className="sm:text-3xl text-3xl font-bold mb-5 text-center">
              Schedule - BarCamp Kathmandu 2024
            </h2>
            <div className="flex items-center justify-center">
              <h3 className="my-0 text-orange-400 font-bold flex">
                <span className="me-3">
                  <svg
                    className="h-5 w-5 text-orange-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                28 September 2024
              </h3>
            </div>
            <div className="mb-8 flex justify-center">
              <div className="mt-2 sm:flex sm:items-center justify-center gap-x-3">
                <Link
                  to="https://wwktm-2023.notion.site/Schedule-BarCamp-Kathmandu-2024-c135f4f03b7447c4bf375b49b86b6562"
                  target="blank"
                  className="flex items-center rounded-full bg-orange-500 px-7 py-3 my-2 text-lg  font-normal text-white hover:bg-orange-700   focus-visible:outline-orange-400"
                >
                  View all Event Day Schedules
                </Link>
              </div>
            </div>
            <div className="text-lg max-w-2xl mx-auto font-medium my-8">
              <img
                alt="Arbyte"
                src={scheduleQr}
                className="max-h-44 w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center mb-6">
              <p className="rounded-full bg-orange-100 px-6 py-2 text-xs font-semibold leading-5">
                🍼 Remember to bring your water bottle on the event day.
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg mx-auto font-medium mb-5 px-3 lg:px-8">
                "Barcamps are informal sessions, a kind of “un-conference”, with
                a schedule decided on the day. It is all driven by the interests
                and expertise of those who attend, so each one is different, but
                ours will be great 😉!"
              </p>
              <p className="text-sm mx-auto font-medium mb-5 px-3 lg:px-8">
                Although the barcamp doesn’t have a strict schedule, it won’t be
                completely devoid of structure! At the barcamp each session runs
                for about 20 minutes, giving enough time to get into the meat of
                a topic, but without a chance of anyone getting bored. These are
                participatory sessions and more inclusive than regular
                conference talks, with everyone taking part. You can help by
                leading the session, by giving some insights, by asking some
                great questions, or maybe just by sharing your enthusiasm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
