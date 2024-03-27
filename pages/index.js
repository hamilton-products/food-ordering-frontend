import axios from "axios";
import Products from "@/components/products";

const MainPage = ({ menu }) => {
  return (
    <>
      <Products menu={menu} />
    </>
  );
};

MainPage.getInitialProps = async () => {
  try {
    const response = await axios.post(
      "https://api.talabatsweets.com/backend/restaurant/get-restaurant-menu-backend",
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if data exists and is not empty
    if (
      response.data &&
      response.data.payload &&
      response.data.payload.length > 0
    ) {
      // Fetch item details for each item in the payload
      const menuWithItemDetails = await Promise.all(
        response.data.payload.map(async (category) => {
          const itemDetailsWithItemData = await Promise.all(
            category.itemDetails.map(async (item) => {
              const itemResponse = await axios.post(
                "https://api.talabatsweets.com/backend/item/get-items",
                {
                  item_id: item.item_id,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              // console.log(itemResponse.data.payload, "itemResponse");

              return {
                ...item,
                item_data: itemResponse.data.payload,
              };
            })
          );

          return {
            ...category,
            itemDetails: itemDetailsWithItemData,
          };
        })
      );

      return {
        menu: menuWithItemDetails,
      };
    } else {
      throw new Error("No data received from API");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: [],
    };
  }
};

export default MainPage;
