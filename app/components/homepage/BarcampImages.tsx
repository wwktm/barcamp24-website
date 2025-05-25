export default function BarcampImages() {
  const slogans: Array<string> = [
    "Cutting-edge technology",
    "Peer to Peer web",
    "Nepalese Tech Companies",
    "Internet governance",
    "Technology for social good",
  ];
  return (
    <section className="sm:-mt-36 mx-auto">
      <div className="overflow-x-hidden">
        <div className="animate-marquee sm:animate-none flex gap-3 sm:justify-center">
          {Array.from({ length: 5 }, (_, index) => index).map((imageIndex) => (
            <img
              key={`image-${imageIndex}`}
              className="max-h-64"
              src={`/homepage-images/image-${imageIndex}.jpg`}
              alt="BarCamp Event"
            />
          ))}
        </div>
        <div className="py-3 bg-orange-500 sm:-rotate-1 sm:-mt-8 sm:mb-10">
          <div className="overflow-x-hidden">
            <div className="animate-marquee sm:animate-none flex gap-3 sm:justify-center">
              {slogans.map((slogan) => (
                <div key={slogan} className="flex gap-2">
                  <div>&#128293;</div>
                  <div className="font-bold text-white">{slogan}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
