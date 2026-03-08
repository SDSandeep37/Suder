"use client"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./checkoutform.css";
import { useState } from "react";
import { useUserContext } from "@/Context";
import { useRouter } from "next/navigation";

const CheckOutForm = ({clientSecret}:any) => {
  const {userData} = useUserContext();
  const user_name = userData?.first_name.concat(` ${userData.last_name}`);
  const stripe = useStripe();
  const elements =  useElements();
  const [loading, setLoading] = useState(false);
  const router  =  useRouter();
  const handleSubmit = async(event:any) =>{
    event.preventDefault();
    if(!stripe || !elements) return;
    setLoading(true);
    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret,{
      payment_method:{
        card:card!,
        billing_details:{
          name:user_name,
          address:{
            line1:"Nagri",
            city:"Ranchi",
            state:"Jharkhand",
            postal_code:"835303",
            country:"IN"
          }
        }
      },
    });
    if(result.error){
      alert(result.error.message);
      return;
    }
    if (result.paymentIntent?.status === "succeeded") {

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_intent_id: result.paymentIntent.id
        })
      });

      alert("Payment Successful");

      // redirect back to dashboard
      router.push("/dashboard");
    }
    setLoading(false);
  }
  return (
     <div className="checkoutContainer mt-4 flex flex-col items-center justify-center w-full max-w-md p-6 rounded-xl shadow-lg">
      <h1 className="font-bold text-3xl mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

        <div className="p-3 border rounded-lg bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>

        <button
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </form>
    </div>
  )
}

export default CheckOutForm