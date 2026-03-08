"use client"

import CheckOutForm from "@/components/CheckOutForm/CheckOutForm";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { stripePromise } from "@/utils/stripe";
import { useUserContext } from "@/Context";

const PaymentPage = () => {
  const searchParams =  useSearchParams();
  const {userData} = useUserContext();
  const router = useRouter();
  const user =  userData?.id
  const email =  userData?.email;
  const user_name = userData ? `${userData.first_name} ${userData.last_name}` : "";
  const id =  searchParams.get('id');
  const amount = searchParams.get('amount')
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    console.log("user id",user);
    if (!user || !id || !amount) return;
    const createPaymentIntent = async () =>{
      try {
         const response =  await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}payments/create-intent`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            amount:Number(amount),
            ride_id:Number(id),
            user_id:user,
            email:email,
            user_name:user_name
          }),
      });
      if(!response.ok){
        const errorData = await response.json();
        console.log(errorData);
        return;
      }
      const data = await response.json();
      console.log(data);
      if(data.paid){
        alert(data.message);
        router.replace("/dashboard");
        return;
      }
      setClientSecret(data.clientSecret);
      } catch (error) {
        console.log(error);
      }
     
    };
    createPaymentIntent();
  },[user,id,amount,user_name,router]);
  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <h1>Pay for your ride</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{clientSecret}}>
          <CheckOutForm clientSecret={clientSecret} />  
        </Elements>
      )}
    </div>
  )
}

export default PaymentPage