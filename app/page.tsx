
import Link from "next/link";

const Page = () => {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1f2937_0%,_#0b0b0b_50%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
              SuDer - Super Delux Ride
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Go anywhere with
              <span className="block text-[#07b67c]">SuDer.</span>
            </h1>
            <p className="max-w-xl text-base text-gray-300 md:text-lg">
              Request a ride in seconds, travel with confidence, and get there
              on your schedule. Premium comfort, everyday pricing.
            </p>

            <div className="grid max-w-md gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
              <input
                type="text"
                placeholder="Enter pickup location"
                className="rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-[#07b67c]"
              />
              <input
                type="text"
                placeholder="Enter destination"
                className="rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-[#07b67c]"
              />
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/dashboard">
                <button className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200">
                  Request now
                </button>
                </Link>
                <button className="rounded-lg border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Schedule for later
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="h-full min-h-[360px] rounded-3xl border border-white/15 bg-gradient-to-br from-[#111827] via-[#0f172a] to-black p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-300">Estimated arrival</p>
                <span className="rounded-full bg-[#07b67c]/20 px-3 py-1 text-xs font-semibold text-[#a8ffd8]">
                  4 mins
                </span>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Pickup
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Ratu Road,Ranchi
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Dropoff
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Piska Nagri, Ranchi
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">SuDer Comfort</p>
                    <p className="text-lg font-bold">₹160.0</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">2 seats • AC ride</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
        <h2 className="text-2xl font-bold md:text-3xl">
          Focused on safety, built for speed
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Verified drivers",
              desc: "Every driver is identity-verified with ride ratings visible before pickup.",
            },
            {
              title: "Live ride tracking",
              desc: "Track your route in real time and share trip progress with trusted contacts.",
            },
            {
              title: "Cashless payments",
              desc: "Pay securely with cards or wallet and view automatic trip receipts.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#111827] to-[#0f766e] p-8 md:p-10">
          <h2 className="text-2xl font-bold md:text-3xl">
            Drive and earn on your own schedule
          </h2>
          <p className="mt-3 max-w-2xl text-gray-200">
            Join SuDer as a partner driver and get paid weekly with flexible
            working hours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Become a driver
            </Link>
            <Link
              href="#"
              className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
