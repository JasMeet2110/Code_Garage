/*its a client side page so we are using "use client" */
"use client";

/*imports*/
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const router = useRouter();

  const buttonStyle = (buttonName: string) => ({
    backgroundColor: '#f97316',
    color: 'white',
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
  
  /* routers */
  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleAdminSignIn = () => {
    router.push('/AdminSignIn');
  
  };

  /* rendered screen for users */
  return (
    <div style={{
      /* background image and layout */ 
      backgroundImage: 'url("/background/ZR1.png")',
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

      {/* logo and heading with description */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: "900px", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: '30px' }}>
          <Image src="/TracksideGarage.png" alt="Logo" width={400} height={300} className="invert brightness-0" />
        </div>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          color: '#f97316',
          letterSpacing: '2px'
        }}>
          Trackside Garage
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '30px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontWeight: 'bold'
        }}>
          Reliable Repairs. Built with Passion.
        </p>
        
        {/* buttons to navigate to different pages */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '15px',
          width: '250px',
          margin: '0 auto'
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