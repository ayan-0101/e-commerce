import { Fragment } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { Button } from "@mui/material";
import { ICONS } from "../../../constants/icon";

const MobileMenu = ({ open, onClose, navigation, onOpenAuthModal }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          {/* Close Button */}
          <div className="flex px-4 pb-1 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close menu</span>
              <ICONS.close aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Categories */}
          <TabGroup>
            <div className="border-b border-gray-200">
              <TabList className="-mb-px flex space-x-8 px-4">
                {navigation.categories.map((category) => (
                  <Tab
                    key={category.name}
                    className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 pb-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                  >
                    {category.name}
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels as={Fragment}>
              {navigation.categories.map((category) => (
                <TabPanel
                  key={category.name}
                  className="space-y-10 px-4 pb-8 pt-10"
                >
                  {/* Featured Items */}
                  <div className="grid grid-cols-2 gap-x-4">
                    {category.featured.map((item) => (
                      <div key={item.name} className="group relative text-sm">
                        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="object-cover object-center"
                          />
                        </div>
                        <button
                          onClick={() => window.location.href = item.href}
                          className="mt-6 block font-medium text-gray-900 text-left"
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
                  {category.sections.map((section) => (
                    <div key={section.name}>
                      <p className="font-medium text-gray-900">
                        {section.name}
                      </p>
                      <ul className="mt-6 flex flex-col space-y-6">
                        {section.items.map((item) => (
                          <li key={item.name} className="flow-root">
                            <button
                              onClick={() => window.location.href = item.href}
                              className="-m-2 block p-2 text-gray-500 hover:text-gray-700 text-left w-full"
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Pages */}
          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            {navigation.pages.map((page) => (
              <div key={page.name} className="flow-root">
                <button
                  onClick={() => window.location.href = page.href}
                  className="-m-2 block p-2 font-medium text-gray-900 hover:text-indigo-600 text-left w-full"
                >
                  {page.name}
                </button>
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                onOpenAuthModal("login");
                onClose();
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onOpenAuthModal("register");
                onClose();
              }}
            >
              Create Account
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MobileMenu;