"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const TermsConditions = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      position: 'relative',
      padding: '20px'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}></div>
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '40px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'orange',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          TERMS AND CONDITIONS
        </h1>

        <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using Sunny Auto services, you accept and agree to be bound by these Terms and Conditions.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>2. Services Provided</h2>
          <p>Sunny Auto provides automotive repair, maintenance, and related services as described on our website and in our service offerings.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>4. Service Appointments</h2>
          <p>Appointments may be scheduled through our website. We reserve the right to reschedule or cancel appointments due to unforeseen circumstances.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>5. Payment Terms</h2>
          <p>Payment is due upon completion of services. We accept various payment methods as indicated at our facility.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>6. Limitation of Liability</h2>
          <p>Sunny Auto shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the modified terms.</p>

          <h2 style={{ color: 'orange', margin: '20px 0 10px 0' }}>8. Contact Information</h2>
          <p>For questions about these Terms and Conditions, please contact us at support@sunnyauto.com</p>
        </div>

        <button 
          onClick={handleBack}
          style={{
            backgroundColor: 'orange',
            color: 'black',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginTop: '30px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          Back to Sign Up
        </button>
      </div>
    </div>
  );
};

export default TermsConditions;