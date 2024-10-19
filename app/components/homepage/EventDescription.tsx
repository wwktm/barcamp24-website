export default function EventDescription() {
  return (
    <section className="bg-gray-100 bg-gradient-to-l from-sky-100 to-orange-50">
      <div className="container">
        <div className="mx-auto max-w-4xl py-20 sm:py-20 lg:py-28">
          <div className="text-center">
            <h1 className="highlighted sm:text-7xl text-4xl font-bold mb-3">
              BarCamp Kathmandu
            </h1>
            <h2 className="text-sky-400 mt-2 sm:text-xl text-xl font-semibold mb-5 pt-2">
              St Xavier’s College, Maitighar
            </h2>
            <div className="my-8 flex justify-center">
              <div className="mt-2 sm:flex sm:items-center justify-center gap-x-3">
                <div className="flex items-center relative rounded-full px-7 py-3 my-2 text-lg  text-black ring-1 ring-orange-100 bg-orange-100">
                  <span className="me-3">
                    <svg
                      className="h-5 w-5 text-gray-600"
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
                  28 September 2024{" "}
                </div>
              </div>
              {/* <div className="flex items-center relative rounded-full px-8 py-3 text-lg leading-6 text-black ring-1 ring-orange-100 bg-orange-100">
                <span className="font-semibold me-3">
                  <svg
                    className="h-5 w-5 text-gray-600"
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
                28 September 2024{" "}
              </div> */}
            </div>
            <p className="text-lg max-w-2xl mx-auto font-medium mb-5">
              BarCamp Kathmandu is an unconference - an ad hoc gathering born
              from the <strong>desire for people to share and learn</strong> in
              an open environment.
            </p>
            <p className="text-lg font-medium">
              It is an opportunity for people to come together to learn,
              network, and discuss great ideas in person.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
