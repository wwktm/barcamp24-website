export default function EventManagement() {
  return (
    <div className="text-xl leading-loose bg-gray-200 border-b-2 border-orange-400">
      <div className="container">
        <h2 className="text-3xl font-bold mb-2 text-center">Supporters</h2>
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-2">
            <h3 className="text-lg font-bold text-center">Managed By</h3>
            <img
              alt="Transistor"
              src="https://wwktm.com/img/logo.png"
              width={158}
              height={48}
              className="max-h-10 w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
