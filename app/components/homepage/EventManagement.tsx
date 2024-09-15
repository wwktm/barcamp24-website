import xavierLogo from "~/images/st-xaviers-logo.png";
import eventsmoLogo from "~/images/eventsmo-logo.png";

export default function EventManagement() {
  return (
    <div
      id="supporters"
      className="py-14 bg-gradient-to-l from-sky-100 to-orange-50 bg-gray-10"
    >
      <div className="container">
        <h2 className="sm:text-3xl text-3xl font-bold mb-12 text-center">
          Supporters
        </h2>
        <div className="mx-auto grid max-w-lg grid-cols-2 justify-center items-start gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-4 text-center">Managed By</h3>
            <img
              alt="Web Weekend Kathmandu"
              src="https://wwktm.com/img/logo.png"
              className="max-h-20 w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-4 text-center">Associate Partner</h3>
            <img
              alt="St Xavier's College"
              src={xavierLogo}
              className="max-h-20 w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-4 text-center">Ticketing partner</h3>
            <img
              alt="St Xavier's College"
              src={eventsmoLogo}
              className="max-h-20 w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
