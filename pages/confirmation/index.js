import axios from "axios";





import React, { useState, useEffect } from 'react';
import OrderStatus from '@/components/OrderStatus';

export default function ConfirmationPage({ restaurantResponse }){
  
  if (restaurantResponse === 'loading') {
    return <div>Loading order status...</div>;
  }
  console.log("saaaaaaaaa",restaurantResponse);
  

  return (
    <>
       <OrderStatus orderStatus={restaurantResponse.res.status}/>
    </>
  );
};



export async function getServerSideProps(context) {
  try {

    const { tap_id } = context.query;

    if (!tap_id) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const restaurantPromise = axios.post(
      "https://apitasweeq.hamiltonkw.com/api/payment/payment-status",
      {
        paymentId: tap_id, // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    // Use Promise.all to resolve all promises concurrently
    const [restaurantResponse] = await Promise.all([
      restaurantPromise
    ]);
    console.log("restaurantResponse",restaurantResponse.data.payload);
    
    if (restaurantResponse.data && restaurantResponse.data.payload) {
      return {
        props: {
          restaurantResponse: restaurantResponse.data.payload,
        },
      };
    } else {
      return {
        props: {
          restaurantResponse: {},
        },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: [],
      },
    };
  }
}
