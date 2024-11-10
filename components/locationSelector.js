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
  const [mode, setMode] = useState("Delivery"); // Default mode
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(null);
  const router = useRouter();

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
  const { locale } = router;


  const locationData=[
    {
      "state_id": 1,
      "name_en": "Ahmadi",
      "name_ar": "الأحمدي",
      "parent_id": 0
    },
    {
      "state_id": 2,
      "name_en": "Mangaf",
      "name_ar": "المنقف",
      "parent_id": 1
    },
    {
      "state_id": 3,
      "name_en": "Fahaheel",
      "name_ar": "الفحيحيل",
      "parent_id": 1
    },
    {
      "state_id": 4,
      "name_en": "Abu Halifa",
      "name_ar": "أبو حليفة",
      "parent_id": 1
    },
    {
      "state_id": 5,
      "name_en": "Mahboula",
      "name_ar": "المهبولة",
      "parent_id": 1
    },
    {
      "state_id": 6,
      "name_en": "Sabahiya",
      "name_ar": "الصباحية",
      "parent_id": 1
    },
    {
      "state_id": 7,
      "name_en": "Riqqa",
      "name_ar": "الرقة",
      "parent_id": 1
    },
    {
      "state_id": 8,
      "name_en": "Al Wafra",
      "name_ar": "الوفرة",
      "parent_id": 1
    },
    {
      "state_id": 9,
      "name_en": "Al Khiran",
      "name_ar": "الخيران",
      "parent_id": 1
    },
    {
      "state_id": 10,
      "name_en": "Zour",
      "name_ar": "الزور",
      "parent_id": 1
    },
    {
      "state_id": 11,
      "name_en": "Bnaider",
      "name_ar": "بنيدر",
      "parent_id": 1
    },
    {
      "state_id": 12,
      "name_en": "Ali Sabah Al-Salem",
      "name_ar": "علي صباح السالم",
      "parent_id": 1
    },
  
    {
      "state_id": 13,
      "name_en": "Farwaniya",
      "name_ar": "الفروانية",
      "parent_id": 0
    },
    {
      "state_id": 14,
      "name_en": "Khaitan",
      "name_ar": "خيطان",
      "parent_id": 13
    },
    {
      "state_id": 15,
      "name_en": "Jleeb Al-Shuyoukh",
      "name_ar": "جليب الشيوخ",
      "parent_id": 13
    },
    {
      "state_id": 16,
      "name_en": "Riggae",
      "name_ar": "الرقعي",
      "parent_id": 13
    },
    {
      "state_id": 17,
      "name_en": "Abdullah Al-Mubarak",
      "name_ar": "عبدالله المبارك",
      "parent_id": 13
    },
    {
      "state_id": 18,
      "name_en": "Ardhiya",
      "name_ar": "العارضية",
      "parent_id": 13
    },
    {
      "state_id": 19,
      "name_en": "Omariya",
      "name_ar": "العمرية",
      "parent_id": 13
    },
    {
      "state_id": 20,
      "name_en": "Rehab",
      "name_ar": "الرحاب",
      "parent_id": 13
    },
    {
      "state_id": 21,
      "name_en": "Ishbiliya",
      "name_ar": "اشبيلية",
      "parent_id": 13
    },
    {
      "state_id": 22,
      "name_en": "Rabiya",
      "name_ar": "الربيعية",
      "parent_id": 13
    },
  
    {
      "state_id": 23,
      "name_en": "Mubarak Al-Kabeer",
      "name_ar": "مبارك الكبير",
      "parent_id": 0
    },
    {
      "state_id": 24,
      "name_en": "Abu Fatira",
      "name_ar": "أبو فطيرة",
      "parent_id": 23
    },
    {
      "state_id": 25,
      "name_en": "Qurain",
      "name_ar": "القرين",
      "parent_id": 23
    },
    {
      "state_id": 26,
      "name_en": "Adan",
      "name_ar": "العدان",
      "parent_id": 23
    },
    {
      "state_id": 27,
      "name_en": "Sabah Al-Salem",
      "name_ar": "صباح السالم",
      "parent_id": 23
    },
    {
      "state_id": 28,
      "name_en": "Messila",
      "name_ar": "المسيلة",
      "parent_id": 23
    },
    {
      "state_id": 29,
      "name_en": "Funaitees",
      "name_ar": "الفنيطيس",
      "parent_id": 23
    },
    {
      "state_id": 30,
      "name_en": "Al-Qusour",
      "name_ar": "القصور",
      "parent_id": 23
    },
    {
      "state_id": 31,
      "name_en": "Al-Sabahiya",
      "name_ar": "الصباحية",
      "parent_id": 23
    },
    {
      "state_id": 32,
      "name_en": "Wafra Residential Area",
      "name_ar": "منطقة الوفرة السكنية",
      "parent_id": 23
    },
    {
      "state_id": 33,
      "name_en": "Kuwait City",
      "name_ar": "مدينة الكويت",
      "parent_id": 0
    },
    {
      "state_id": 34,
      "name_en": "Dasman",
      "name_ar": "دسمان",
      "parent_id": 33
    },
    {
      "state_id": 35,
      "name_en": "Sharq",
      "name_ar": "شرق",
      "parent_id": 33
    },
    {
      "state_id": 36,
      "name_en": "Bneid Al Gar",
      "name_ar": "بنيد القار",
      "parent_id": 33
    },
    {
      "state_id": 37,
      "name_en": "Qibla",
      "name_ar": "قبلة",
      "parent_id": 33
    },
    {
      "state_id": 38,
      "name_en": "Salhiya",
      "name_ar": "الصالحية",
      "parent_id": 33
    },
    {
      "state_id": 39,
      "name_en": "Mirqab",
      "name_ar": "المرقاب",
      "parent_id": 33
    },
    {
      "state_id": 40,
      "name_en": "Mubarakiya",
      "name_ar": "المباركية",
      "parent_id": 33
    },
    {
      "state_id": 41,
      "name_en": "Abdullah Al-Salem",
      "name_ar": "عبد الله السالم",
      "parent_id": 33
    },
    {
      "state_id": 42,
      "name_en": "Al Shuwaikh",
      "name_ar": "الشويخ",
      "parent_id": 33
    },
    {
      "state_id": 43,
      "name_en": "Hawalli",
      "name_ar": "حولي",
      "parent_id": 0
    },
    {
      "state_id": 44,
      "name_en": "Salmiya",
      "name_ar": "السالمية",
      "parent_id": 43
    },
    {
      "state_id": 45,
      "name_en": "Jabriya",
      "name_ar": "الجابرية",
      "parent_id": 43
    },
    {
      "state_id": 46,
      "name_en": "Bayan",
      "name_ar": "بيان",
      "parent_id": 43
    },
    {
      "state_id": 47,
      "name_en": "Mishref",
      "name_ar": "مشرف",
      "parent_id": 43
    },
    {
      "state_id": 48,
      "name_en": "Rumaithiya",
      "name_ar": "الرميثية",
      "parent_id": 43
    },
    {
      "state_id": 49,
      "name_en": "Maidan Hawalli",
      "name_ar": "ميدان حولي",
      "parent_id": 43
    },
    {
      "state_id": 50,
      "name_en": "Shaab",
      "name_ar": "الشعب",
      "parent_id": 43
    },
    {
      "state_id": 51,
      "name_en": "Hateen",
      "name_ar": "حطين",
      "parent_id": 43
    },
    {
      "state_id": 52,
      "name_en": "Salwa",
      "name_ar": "سلوى",
      "parent_id": 43
    },
    {
      "state_id": 53,
      "name_en": "Jahra City",
      "name_ar": "الجهراء",
      "parent_id": 0
    },
    {
      "state_id": 54,
      "name_en": "Saad Al Abdullah",
      "name_ar": "مدينة سعد العبدالله",
      "parent_id": 53
    },
    {
      "state_id": 55,
      "name_en": "Al Naeem",
      "name_ar": "النعيم",
      "parent_id": 53
    },
    {
      "state_id": 56,
      "name_en": "Al Mutlaa",
      "name_ar": "المطلاع",
      "parent_id": 53
    },
    {
      "state_id": 57,
      "name_en": "Subiya",
      "name_ar": "الصبية",
      "parent_id": 53
    },
    {
      "state_id": 58,
      "name_en": "Abdali",
      "name_ar": "العبدلي",
      "parent_id": 53
    },
    {
      "state_id": 59,
      "name_en": "Kabd",
      "name_ar": "كبد",
      "parent_id": 53
    },
    {
      "state_id": 60,
      "name_en": "Waha",
      "name_ar": "الواحة",
      "parent_id": 53
    }
  ];

  const processData = (data)=> {
    const result = {};
  
    data.forEach((item) => {
      if (item.parent_id === 0) {
        result[locale=="en"?item.name_en:item.name_ar] = [];
      }
    });
  
    data.forEach((item) => {
      if (item.parent_id !== 0) {
        const parent = data.find((parent) => parent.state_id === item.parent_id);
        if (parent) {
          result[locale=="en"?parent.name_en:parent.name_ar].push(locale=="en"?item.name_en:item.name_ar);
        }
      }
    });
  
    return result;
  }


  
  
  const processedData = processData(locationData);
  console.log(processedData);
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
