"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const AdminProfile = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
      color: 'white',
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


      <header style={{
        position: 'relative',
        zIndex: 2,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          color: 'orange',
          margin: 0
        }}>
          SUNNY AUTO ADMIN
        </h1>
        
        <button 
          onClick={handleBackToDashboard}
          style={{
            backgroundColor: 'orange',
            color: 'black',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '30px',
            color: 'orange'
          }}>
            ADMIN PROFILE
          </h2>
          
          {/* Profile Picture */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: 'orange',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'black'
          }}>
            👤
          </div>

          {/* Profile Information */}
          <div style={{
            textAlign: 'left',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            borderRadius: '10px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'orange' }}>Name:</strong> Admin User
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'orange' }}>Email:</strong> admin@sunnyauto.com
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'orange' }}>Role:</strong> Super Administrator
            </div>
            <div>
              <strong style={{ color: 'orange' }}>Last Login:</strong> Today at 2:45 PM
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'orange',
                color: 'black',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;