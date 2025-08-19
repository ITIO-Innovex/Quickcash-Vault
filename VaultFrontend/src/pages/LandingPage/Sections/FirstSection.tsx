import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import CustomButton from '@/components/CustomButton';
import { useNavigate } from 'react-router-dom';

const FirstSection: React.FC = () => {
  const theme = useTheme();
  const navigate  = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

   const signup = () =>{
    navigate('/register');
  }

   const contact = () =>{
    navigate('/contact');
  }

  useEffect(() => {
   const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <Box
      className="hero-wrapper"
    >
      <Box ref={containerRef} className={`container ${isVisible ? 'visible' : ''}`} sx={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'transparent', }} >
        <Box className="hero-content">

          <Typography variant="h2" component="h1" className="hero-title" sx={{ color: theme.palette.navbar?.text || '#fff',}} >
            Seamlessly Bridge Your{' '}
            <span className="highlight">Financial</span> World
          </Typography>

          <Typography className="hero-subtext" sx={{ color: theme.palette.navbar?.text || '#eee', opacity: 0.8 }}>
            Manage Crypto and Fiat with One Unified Platform.
          </Typography>

          <Box className="hero-buttons">
            <CustomButton className="btn btn-primary" onClick={signup}>Create a Free Account</CustomButton>
            <CustomButton className="btn btn-primary" onClick={contact}>Speak to Sales</CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FirstSection;
