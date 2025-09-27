"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSignUp = () => {
    router.push('/signin');
  };

  const handleTermsClick = () => {
    router.push('/Termscondition');
  };

  return (
    <div style={{ 
      backgroundImage: 'url("/background/ZR1.png")',
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
        backgroundColor: 'rgba(243, 244, 246, 0.8)',
        padding: '40px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: 'black',
          textAlign: 'center',
        }}>
          Create Account
        </h1>

        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'black'}}>
              Full Name
            </label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '2px solid #333',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>
              Email
            </label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '2px solid #333',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="Create a password" 
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '2px solid #333',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>
              Confirm Password
            </label>
            <input 
              type="password" 
              placeholder="Confirm your password" 
              style={{
                padding: '12px 15px',
                borderRadius: '8px',
                border: '2px solid #333',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                fontSize: '1rem',
                width: '100%'
              }}
            />
          </div>

          {/* Terms and Conditions Link */}
          <div style={{ 
            marginBottom: '20px', 
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            <span style={{ marginRight: '5px', color: 'black' }}>By creating an account, you agree to our</span>
            <span 
              style={{ 
                color: '#f97316', 
                cursor: 'pointer', 
                textDecoration: 'underline',
                fontWeight: 'bold'
              }}
              onClick={handleTermsClick}
            >
              Terms and Conditions
            </span>
          </div>

          {/* Sign Up Button */}
          <button 
            onClick={handleSignUp}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              padding: '15px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              width: '100%',
              marginBottom: '20px'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Back to Home Button */}
        <button 
          onClick={handleBackToHome}
          style={{
            backgroundColor: 'transparent',
            color: 'black',
            border: '2px solid black',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Signup;