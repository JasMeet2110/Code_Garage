"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const router = useRouter();

  const buttonStyle = (buttonName: string) => ({
    backgroundColor: hoveredButton === buttonName ? '#ff8c00' : 'orange',
    color: 'black',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transform: hoveredButton === buttonName ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.2s, background-color 0.2s',
    width: '100%'
  });
  
  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleAdminSignIn = () => {
    router.push('/AdminSignIn');
  
  };

  return (
    <div style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      position: 'relative'
    }}>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          color: 'orange',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '2px'
        }}>
          SUNNY AUTO
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '40px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontWeight: 'bold'
        }}>
          Premium Auto Repair & Service
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '15px',
          width: '250px'
        }}>
          <button 
            style={buttonStyle('signin')}
            onMouseEnter={() => setHoveredButton('signin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleSignIn}
          >
            Sign in
          </button>
          
          <button 
            style={buttonStyle('signup')}
            onMouseEnter={() => setHoveredButton('signup')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          
          <button 
            style={buttonStyle('admin')}
            onMouseEnter={() => setHoveredButton('admin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleAdminSignIn}
          >
            Sign in as admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;