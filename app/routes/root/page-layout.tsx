import { Link, useNavigate, useSearchParams } from 'react-router';
import { logoutUser } from "~/appwrite/auth";
import type { Route } from './+types/page-layout';
import { account } from '~/appwrite/client';
import { allTrips } from '~/constants';
import { getAllTrips } from '~/appwrite/trips';
import { parseTripData } from '~/lib/utils';
import { useState, useEffect } from 'react';
import { TripCard } from '../admin/components';


export const loader = async ({ request }: any) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = 8;
    const offset = (page - 1) * limit;

    const tripsData = await getAllTrips(limit, offset);

    const trips = tripsData.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? []
    }));

    return {
      user: null,
      trips,
      total: tripsData.total,
      currentPage: page
    };
  } catch (error) {
    console.log('Loader - Error:', error);
    return {
      user: null,
      trips: allTrips.slice(0, 8),
      total: allTrips.length,
      currentPage: 1
    };
  }
};

const TripManLanding = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trips, total, currentPage: initialPage } = loaderData;
  const [user, setUser] = useState<any>(null);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(total / itemsPerPage);

      useEffect(() => {
      account.get()
        .then(setUser)
        .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleGetStarted = () => navigate("/sign-in");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SimpleTripCard = ({ 
    trip, 
    size = 'medium'
  }: {
    trip: any;
    size?: 'small' | 'medium' | 'large';
  }) => {
    const sizeClasses = {
      small: 'h-[224px]',
      medium: 'h-[297px]',
      large: 'h-[390px]'
    };

    const textSizes = {
      small: { title: 'p-16-semibold', text: 'text-xs' },
      medium: { title: 'p-20-semibold', text: 'text-sm' },
      large: { title: 'p-20-semibold', text: 'text-sm' }
    };

    const iconSizes = {
      small: 'size-3',
      medium: 'size-4',
      large: 'size-4'
    };

    return (
      <div 
        className={`w-full ${sizeClasses[size]} rounded-[14px] relative overflow-hidden cursor-pointer`}
        onClick={() => navigate(`/trips/${trip.id}`)}
      >
        <img
          src={trip.imageUrls?.[0]}
          alt={trip.name}
          className="w-full h-full object-cover rounded-[14px]"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
          <h2 className={`text-white ${textSizes[size].title}`}>{trip.name}</h2>
          <figure className="flex items-center gap-2 mt-1">
            <img src="/assets/icons/location-mark.svg" alt="location" className={iconSizes[size]} />
            <figcaption className={`text-white ${textSizes[size].text}`}>
              {trip.itinerary?.[0]?.location ?? ""}
            </figcaption>
          </figure>
        </div>
      </div>
    );
  };

  const Pagination = () => {
    const getPageNumbers = () => {
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, total);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div className="text-gray-600 p-14-regular">
          Showing {startItem} to {endItem} of {total} trips
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg border ${
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg border ${
                currentPage === page
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg border ${
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative w-full h-[680px] bg-auth bg-cover bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <header className="wrapper relative z-10 h-[100px] flex items-center justify-between py-[30px]">
          <Link to="/" className="link-logo border-none py-0">
            <img src="/assets/icons/logo.svg" alt="Tripman logo" className="size-[30px]" />
            <h1 className="p-28-bold text-white">Tripman</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
              <span className="p-16-semibold">Logout</span>
            </button>
          </div>
        </header>
        <div className="wrapper relative z-10">
          <div className="flex flex-col mt-32 md:mt-60 gap-6 max-w-[514px]">
            <h2 className="font-figtree font-bold text-[72px] leading-[79.2px] tracking-[0px] text-white">
              Plan Your Trip with Ease
            </h2>
            <p className="p-18-regular text-white">
              Customize your travel itinerary in minutes—pick your destination, set your preferences, and explore with confidence.
            </p>
            <button
              onClick={handleGetStarted}
              className="w-fit px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-20-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="wrapper flex flex-col gap-10 pb-20">
        <div className="flex flex-col gap-5 mt-2.5">
          <h1 className="p-30-bold text-dark-100">Featured Travel Destinations</h1>
          <p className="p-18-regular text-gray-100">Check out some of the best places you can visit around the world.</p>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-2 row-span-1">
            <SimpleTripCard trip={trips[0]} size="medium" />
          </div>
          <div className="col-span-1 row-span-2 flex flex-col gap-2.5">
            {trips.slice(1, 6).map((trip) => (
              <SimpleTripCard key={trip.id} trip={trip} size="small" />
            ))}
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-2.5">
            {trips.slice(2, 6).map((trip) => (
              <SimpleTripCard key={trip.id} trip={trip} size="large" />
            ))}
          </div>
        </div>
      </section>

      <section className="wrapper flex flex-col gap-10 pb-20">
        <div className="flex flex-col gap-5">
          <h2 className="p-30-bold text-dark-100">Handpicked Trips</h2>
          <p className="p-18-regular text-gray-100">Browse well-planned trips designed for different travel styles and interests.</p>
        </div>
        <div className="trip-grid"> 
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              location={trip.itinerary?.[0]?.location ?? ""}
              imageUrl={trip.imageUrls?.[0]}
              tags={[trip.interests, trip.travelStyle].filter(Boolean)}
              price={trip.estimatedPrice}
            />
          ))}
        </div>
        {totalPages > 1 && <Pagination />}
      </section>
    </div>
  );
};

export default TripManLanding;