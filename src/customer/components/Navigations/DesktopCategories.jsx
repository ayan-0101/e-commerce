import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";

const DesktopCategories = ({ navigation }) => {
  return (
    <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
      <div className="flex h-full space-x-8">
        {navigation.categories.map((category) => (
          <Popover key={category.name} className="flex">
            <div className="relative flex">
              <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:border-indigo-600 data-[open]:text-indigo-600 outline-none">
                {category.name}
              </PopoverButton>
            </div>

            <PopoverPanel
              transition
              className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 top-1/2 bg-white shadow"
              />

              <div className="relative bg-white">
                <div className="mx-auto max-w-7xl px-8">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                    {/* Featured Items */}
                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                      {category.featured.map((item) => (
                        <div
                          key={item.name}
                          className="group relative text-base sm:text-sm"
                        >
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                            <img
                              alt={item.imageAlt}
                              src={item.imageSrc}
                              className="object-cover object-center"
                            />
                          </div>
                          <button
                            onClick={() => window.location.href = item.href}
                            className="mt-6 block font-medium text-gray-900 text-left hover:text-indigo-600 transition-colors"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </button>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Sections */}
                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                      {category.sections.map((section) => (
                        <div key={section.name}>
                          <p className="font-medium text-gray-900 mr-32">
                            {section.name}
                          </p>
                          <ul className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                            {section.items.map((item) => (
                              <li key={item.name} className="flex">
                                <button
                                  onClick={() => window.location.href = item.href}
                                  className="hover:text-gray-800 text-left transition-colors"
                                >
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        ))}

        {/* Pages */}
        {navigation.pages.map((page) => (
          <button
            key={page.name}
            onClick={() => window.location.href = page.href}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
          >
            {page.name}
          </button>
        ))}
      </div>
    </PopoverGroup>
  );
};

export default DesktopCategories;