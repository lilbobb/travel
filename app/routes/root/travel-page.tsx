import { Link, useLoaderData } from "react-router";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { TripCard } from "../admin/components";

export const loader = async () => {
  const trips = await getAllTrips(4, 0);

  const allTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetails),
    imageUrls: imageUrls ?? [],
  }));

  return { allTrips };
};

const TravelPage = () => {
  const { allTrips } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <main className="min-h-screen bg-light-200">
      <section
        className="relative bg-[var(--background-image-hero)] bg-cover bg-center h-[60vh] flex-center text-white"
        style={{ backgroundImage: "var(--background-image-linear100)" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="p-40-semibold mb-4">Discover Your Next Adventure</h1>
          <p className="p-18-regular mb-6 text-gray-100">
            Explore the world with our curated travel experiences.
          </p>
          <div className="flex justify-center gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="p-3.5 border border-light-400 rounded-l-xl text-base text-dark-300 font-normal focus:outline-none"
            />
            <button className="button-class bg-primary-100 text-white p-3.5 rounded-r-xl hover:bg-primary-500">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 wrapper">
        <h2 className="p-30-bold text-center mb-8 text-dark-100">Featured Trips</h2>
        <div className="trip-grid">
          {allTrips.length > 0 ? (
            allTrips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id.toString()}
                name={trip.name!}
                imageUrl={trip.imageUrls[0] || "/assets/images/default-trip.jpg"}
                location={trip.itinerary?.[0]?.location ?? "Unknown Location"}
                tags={[trip.interests!, trip.travelStyle!]}
                price={trip.estimatedPrice!}
              />
            ))
          ) : (
            <p className="text-center p-18-regular text-gray-500">
              No trips available at the moment.
            </p>
          )}
        </div>
      </section>

      <section className="bg-primary-100 text-white py-12 text-center">
        <h3 className="p-24-semibold mb-4">Ready to Start Your Journey?</h3>
        <p className="p-18-regular mb-6">Sign in to plan your trip or explore more destinations.</p>
        <Link
          to="/sign-in"
          className="button-class-secondary text-primary-100 p-2 px-4 rounded-xl hover:bg-light-300"
        >
          Sign In
        </Link>
      </section>
    </main>
  );
};

export default TravelPage;