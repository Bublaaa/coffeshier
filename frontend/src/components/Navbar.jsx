import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <nav className="bg-white border-gray-200 rounded-xl">
        <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-cta"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta"
          >
            <form className="flex items-center min-w-lg">
              <label className="sr-only">Search</label>
              <div className="relative w-full">
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-4"
                  placeholder="Search branch name..."
                  required
                />
              </div>

              <button
                type="submit"
                className="p-2.5 ms-2 text-sm font-medium text-white bg-accent rounded-lg border border-accent hover:bg-accent-hover focus:ring-4 focus:outline-none focus:ring-accent"
              >
                <Search />
                <span className="sr-only">Search</span>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
