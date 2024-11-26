import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/router";

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

  const router = useRouter();
  const { locale } = router;
  const [mode, setMode] = useState("Delivery"); // Default mode
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    locale === "ar" ? "اختر موقعك" : "Select Location"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [open, setOpen] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setIsEditing(false); // Close popup after selection
    localStorage.setItem("defaultLocation", location); // Save the selected location
  };

  const handleOpen = (value) => {
    setOpen(open === value ? null : value);
  };


  const DeliveryArea = async () => {
    try {
      const response = await fetch(
        "https://api.hamilton-bites.online/api/locations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "lang":locale
      
          },
        }
      );
      const data = await response.json();
      setLocationData(data.payload);
    } catch (error) {
      console.error("Error checking delivery area:", error);
      return false;
    }
  };

  useEffect(() => {
    // Check for default location in localStorage
    const savedLocation = localStorage.getItem("defaultLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }

    DeliveryArea();
  }, []);

  const processData = (data) => {
    const result = {};

    data.forEach((item) => {
      if (!item.parent_id) {
        result[locale === "en" ? item.name_en : item.name_ar] = [];
      }
    });

    data.forEach((item) => {
      if (item.parent_id) {
        const parent = data.find((parent) => parent._id === item.parent_id);
        if (parent) {
          result[locale === "en" ? parent.name_en : parent.name_ar].push(
            locale === "en" ? item.name_en : item.name_ar
          );
        }
      }
    });

    return result;
  };

  const processedData = processData(locationData);

  const filteredData = Object.entries(processedData).reduce((acc, [governorate, places]) => {
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
    <div className={`px-6 py-2 ${locale === "ar" ? "rtl" : "ltr"}`}>
      {/* Delivery and Pickup Toggle */}
      <div className="flex space-x-4 mb-4">
        <Button
          color={mode === "Delivery" ? "orange" : "gray"}
          onClick={() => setMode("Delivery")}
        >
          {locale === "en" ? "Delivery" : "توصيل"}
        </Button>
        <Button
          variant={mode === "Pickup" ? "outlined" : "text"}
          onClick={() => setMode("Pickup")}
        >
          {locale === "en" ? "Pickup" : "استلام"}
        </Button>
      </div>

      {/* Location Display */}
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="delivery-icon">
            🚴
          </span>
          <span>{locale === "en" ? "Deliver to" : "التوصيل إلى"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <strong>{selectedLocation}</strong>
          <Button variant="text" color="orange" onClick={() => setIsEditing(true)}>
            {locale === "en" ? "Edit" : "تعديل"}
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
        <DialogHeader className="text-lg font-semibold">
          {locale === "en" ? "Choose Your Location" : "اختر موقعك"}
        </DialogHeader>
        <DialogBody divider>
          <Input
            label={locale === "en" ? "Search..." : "بحث..."}
            onChange={handleSearch}
            className="mb-4"
          />
          <div>
            {Object.entries(filteredData).map(([governorate, places], idx) => (
              <Accordion open={open === idx} key={idx}>
                <AccordionHeader
                  onClick={() => handleOpen(idx)}
                  className="flex items-center justify-between relative"
                >
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
                    <p>{locale === "en" ? "No places available" : "لا توجد أماكن متاحة"}</p>
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
            {locale === "en" ? "Close" : "إغلاق"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
