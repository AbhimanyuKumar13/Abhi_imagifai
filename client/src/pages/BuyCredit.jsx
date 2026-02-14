import { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./BuyCredit.module.css";

const BuyCredit = () => {
  const { user, backendUrl, loadCreditsData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credit Payment",
      description: "Credit payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (res) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razor",
            {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            },
            { withCredentials: true }
          );

          if (data.success) {
            loadCreditsData();
            navigate("/");
            toast.success("Credit Added");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          toast.error("Payment verification error");
        }
      },
      theme: { color: "#111827" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/pay-razor",
        { planId },
        { withCredentials: true }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.page}
    >
      <div className={styles.header}>
        <span className={styles.badge}>Our Plans</span>
        <h1 className={styles.title}>Choose the plan</h1>
      </div>

      <div className={styles.planContainer}>
        {plans.map((item, index) => (
          <div key={index} className={styles.card}>
            <img
              src={assets.logo_icon}
              alt="icon"
              className={styles.icon}
            />

            <h3 className={styles.planName}>{item.id}</h3>
            <p className={styles.desc}>{item.desc}</p>

            <div className={styles.priceSection}>
              <span className={styles.price}>
                ₹{item.price}
              </span>
              <span className={styles.credits}>
                / {item.credits} credits
              </span>
            </div>

            <button
              onClick={() => paymentRazorpay(item.id)}
              className={styles.cta}
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
