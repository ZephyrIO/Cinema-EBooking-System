'use client';
import './RegisterConfirm.css';
import { useRouter } from 'next/navigation';

export default function RegisterConfirm() {
  const router = useRouter(); // Initialize the router

  const handleLoginRedirect = () => {
    router.push('/login'); // Redirect to the login page
  };

  const handleHomeRedirect = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <div className="register-confirm">
      <h2>You Have Successfully Registered!</h2>
      <p>Please check your email to verify your account.</p>
      <div className="button-group">
        <button type="button" className="home" onClick={handleHomeRedirect}>
          Go to Home
        </button>
        <button type="button" className="login" onClick={handleLoginRedirect}>
          Login to your Account
        </button>
      </div>
    </div>
  );
}
