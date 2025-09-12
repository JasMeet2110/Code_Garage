"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const AdminHome = () => {
  const router = useRouter();



  const handleLogout = () => {
    router.push('/');
  };

  const handleProfile = () => {
    router.push('/Adminprofile');
  };

  const handleSection = (section: string) => {
    alert(`Opening ${section} section`);
    // You can add routing for each section later
    // router.push(`/admin/${section.toLowerCase()}`);
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

      {/* Header with Profile Icon */}
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
          onClick={handleProfile}
          style={{
            backgroundColor: 'orange',
            color: 'black',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Admin Profile"
        >
          👤
        </button>
      </header>

      {/* Main Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        padding: '40px 20px',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '30px',
            color: 'orange'
          }}>
            ADMIN DASHBOARD
          </h2>
          
          <p style={{ 
            fontSize: '1.2rem', 
            marginBottom: '50px',
            fontWeight: 'bold'
          }}>
            Welcome to Sunny Auto Admin Panel - Manage everything in one place
          </p>

          {/* Dashboard Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px',
            marginBottom: '50px'
          }}>
            {/* Inventory */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid orange',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSection('Inventory')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📦</div>
              <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>Inventory Management</h3>
              <p>Manage parts, tools, and stock levels</p>
            </div>
            
            {/* Appointments */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid orange',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSection('Appointments')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📅</div>
              <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>Appointments</h3>
              <p>View and manage service bookings</p>
            </div>
            
            {/* Employees */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid orange',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSection('Employees')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
              <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>Employees</h3>
              <p>Manage staff and work schedules</p>
            </div>
            
            {/* Customers */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid orange',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSection('Customers')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
              <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>Customers</h3>
              <p>Manage customer database and history</p>
            </div>

            {/* Reports */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid orange',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSection('Reports')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📊</div>
              <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>Reports & Analytics</h3>
              <p>Generate business reports and insights</p>
            </div>

            {/* Finance */}
            <div 
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid orange',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center'
              }}
              onClick={() => handleSection('Finance')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
              <h3 style={{ color: 'orange', marginBottom: '10px', fontSize: '1.3rem' }}>Finance</h3>
              <p>Manage payments, invoices, and accounting</p>
            </div>
          </div>


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

export default AdminHome;