const Razorpay = require("razorpay");
const crypto = require("crypto");

let razorpayInstance = null;


// get razorpay instance
const getRazorpayInstance = () => {

 if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are not configured in environment variables");
 }

 if (!razorpayInstance) {

  razorpayInstance = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET
  });

 }

 return razorpayInstance;

};



// create payment order
const createOrder = async (
 amount,
 currency = "INR",
 receipt = `receipt_${Date.now()}`
) => {

 try {

  const instance = getRazorpayInstance();

  const options = {
   amount: amount * 100, // convert rupees → paise
   currency,
   receipt
  };

  const order = await instance.orders.create(options);

  return order;

 } catch (error) {

  console.error("Razorpay order creation error:", error);

  throw new Error("Failed to create Razorpay order");

 }

};



// verify payment signature
const verifyPaymentSignature = (
 orderId,
 paymentId,
 signature
) => {

 try {

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generatedSignature = crypto
   .createHmac("sha256", secret)
   .update(`${orderId}|${paymentId}`)
   .digest("hex");

  return generatedSignature === signature;

 } catch (error) {

  console.error("Payment verification error:", error);

  return false;

 }

};


module.exports = {
 createOrder,
 verifyPaymentSignature
};

