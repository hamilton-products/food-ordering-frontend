import React, { useState } from "react";
import {
  Button,
  Input,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const data = {
  "Ahmadi": [],
  "Mubarak Al-Kabeer": [],
  "Farwaniya": [],
  "Hawalli": [],
  "Jahra": [],
  "Kuwait City": [
    "Abdulla Al-Salem",
    "Adailiya",
    "Al-Nahda",
    "Al-Sour Gardens",
    "Bneid Al Qar",
    "Daiya",
    "Dasma",
    "Dasman",
  ],
};

// Custom SVGs for Arrows
const ChevronDownSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 absolute right-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 absolute right-0"
    fill="none"
    viewBox="0 0 24 24"
    
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
  </svg>
);

export default function LocationSelector() {
  const [mode, setMode] = useState("Delivery"); // Default mode
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setIsEditing(false); // Close popup after selection
  };

  const handleOpen = (value) => {
    setOpen(open === value ? null : value);
  };

  const filteredData = Object.entries(data).reduce((acc, [governorate, places]) => {
    if (
      governorate.toLowerCase().includes(searchTerm) ||
      places.some((place) => place.toLowerCase().includes(searchTerm))
    ) {
      acc[governorate] = places.filter((place) =>
        place.toLowerCase().includes(searchTerm)
      );
    }
    return acc;
  }, {});

  return (
    <div className="p-6 mx-auto">
      {/* Delivery and Pickup Toggle */}
      <div className="flex space-x-4 mb-4">
        <Button
          color={mode === "Delivery" ? "orange" : "gray"}
          onClick={() => setMode("Delivery")}
        >
          Delivery
        </Button>
        <Button
          variant={mode === "Pickup" ? "outlined" : "text"}
          onClick={() => setMode("Pickup")}
        >
          Pickup
        </Button>
      </div>

      {/* Location Display */}
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="delivery-icon">
            🚴
          </span>
          <span>Deliver to</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong>{selectedLocation}</strong>
          <Button variant="text" color="orange" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      </div>

      {/* Popup Modal */}
      <Dialog
        open={isEditing}
        handler={setIsEditing}
        size="sm" // Small width
        className="rounded-lg shadow-xl"
      >
        <DialogHeader className="text-lg font-semibold">Choose Your Location</DialogHeader>
        <DialogBody divider>
          <Input
            label="Search..."
            onChange={handleSearch}
            className="mb-4"
          />
          <div>
            {Object.entries(filteredData).map(([governorate, places], idx) => (
              <Accordion open={open === idx} key={idx}>
                <AccordionHeader onClick={() => handleOpen(idx)} className="flex items-center justify-between relative">
                  {governorate}
                  {open === idx ? <ChevronUpSVG /> : <ChevronDownSVG />}
                </AccordionHeader>
                <AccordionBody>
                  {places.length > 0 ? (
                    places.map((place) => (
                      <div
                        key={place}
                        className="py-2 cursor-pointer hover:text-orange-500"
                        onClick={() => handleSelectLocation(place)}
                      >
                        {place}
                      </div>
                    ))
                  ) : (
                    <p>No places available</p>
                  )}
                </AccordionBody>
              </Accordion>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsEditing(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
