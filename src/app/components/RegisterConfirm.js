'use client';
import './RegisterConfirm.css';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function RegisterConfirm() {
  const router = useRouter(); // Initialize the router

  const handleLoginRedirect = () => {
    router.push('/login'); // Redirect to the login page
  };

  return (
    <div>
      <h2>You Have Successfully Registered!</h2>
      <button type="button" className="login" onClick={handleLoginRedirect}>
        Login to your Account
      </button>
    </div>
  );
}
