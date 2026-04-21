import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/payment.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/check-subscription/${userId}`);
        const data = await res.json();
        
        if (data.isPro) {
          localStorage.setItem("userPlan", data.planType || "pro");
          setStatus("success");
          setTimeout(() => navigate("/analytics"), 3000);
        } else {
          setStatus("pending");
        }
      } catch (err) {
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [navigate]);

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        {loading ? (
          <>
            <div className="payment-spinner">💳</div>
            <h2>Processing your payment...</h2>
            <p>Please wait while we confirm your subscription</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="success-icon">🎉</div>
            <h2>Payment Successful!</h2>
            <p>You are now a Pro member! 🚀</p>
            <p>Redirecting you to Analytics...</p>
            <button onClick={() => navigate("/analytics")} className="success-btn">
              Go to Analytics Now →
            </button>
          </>
        ) : (
          <>
            <div className="error-icon">⚠️</div>
            <h2>Payment Processing</h2>
            <p>Your payment is being processed.</p>
            <p>You will get access shortly.</p>
            <button onClick={() => navigate("/dashboard")} className="success-btn">
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}