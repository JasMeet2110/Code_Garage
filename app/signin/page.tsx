"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Signin = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSignIn = () => {
    alert('Sign in button clicked! This is frontend only.');
  };

  return (
    <div style={{ 
      backgroundImage: 'url("https://i.pinimg.com/736x/69/15/0f/69150f5756974f604b8e6b3b7ee2890b.jpg")',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '40px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '30px',
          color: 'orange',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          SIGN IN
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            style={{
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #333',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'black',
              fontSize: '1rem',
              width: '100%',
              marginBottom: '20px'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <input 
            type="password" 
            placeholder="Password" 
            style={{
              padding: '15px',
              borderRadius: '8px',
              border: '2px solid #333',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'black',
              fontSize: '1rem',
              width: '100%'
            }}
          />
        </div>

        <button 
          onClick={handleSignIn}
          style={{
            backgroundColor: 'orange',
            color: 'black',
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
          SIGN IN
        </button>

        <button 
          onClick={handleBackToHome}
          style={{
            backgroundColor: 'transparent',
            color: 'orange',
            border: '2px solid orange',
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

export default Signin;