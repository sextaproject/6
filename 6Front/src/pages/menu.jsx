import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, styled, Paper, Container, Box, Grid, Button, useTheme, useMediaQuery } from '@mui/material';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';

const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px', 
  backgroundColor: theme.palette.background.paper, 
  border: `1px solid ${theme.palette.divider}`, 
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  minHeight: '250px', 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[2],
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: '200px',
    borderRadius: '16px',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6], 
    borderColor: theme.palette.primary.light,
    [theme.breakpoints.down('sm')]: {
      transform: 'translateY(-3px)',
    },
  },
  '& .icon': {
    transition: 'transform 0.3s ease',
    color: '#2f84e4', 
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
      marginBottom: theme.spacing(1.5),
    },
  },
  '&:hover .icon': {
    transform: 'scale(1.1)',
    [theme.breakpoints.down('sm')]: {
      transform: 'scale(1.05)',
    },
  },
}));

const CreatorButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(1, 3),
  borderRadius: '8px',
  backgroundColor:'#2f84e4', 
  color: theme.palette.primary.contrastText, 
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(1, 2.5),
    fontSize: '0.85rem',
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, 
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    [theme.breakpoints.down('sm')]: {
      transform: 'translateY(-1px)',
    },
  },
}));

const CommonBackground = styled(Box)(({ theme }) => ({
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: theme.palette.background.default,
  backgroundImage: `linear-gradient(${theme.palette.primary.main} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.primary.main} 1px, transparent 1px)`,
  backgroundSize: '30px 30px', opacity: 0.04, pointerEvents: 'none', zIndex: -1,
}));

function Menu() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const services = [
    { title: 'NUMBERS', icon: <BlurOnIcon className="icon" />, path: '/Numbers', description: 'Calculadora'},
    { title: 'X - RAY', icon: <SensorOccupiedIcon className="icon" />, path: '/rX', description: 'Sistema de Interpretación Rayos X' },
    { title: 'PHARMA GO', icon: <AutoStoriesIcon className="icon" />, path: '/pharmaGo', description: 'Base de Medicamentos' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', overflowY: 'auto', 
        overflowX: 'hidden', py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 },}}>
        
        <CommonBackground />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ pt: { xs: 4, sm: 6 }, pb: { xs: 2, sm: 4 }, display: 'flex', 
          flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="h2" component="h1" 
            sx={{ 
              color: '#6893c3', mb: 1, textAlign: 'center',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 700, letterSpacing: '18px',}}>
            SEXTA
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#6893c3', mb: { xs: 3, sm: 4 }, textAlign: 'center', 
              maxWidth: '800px',fontSize: { xs: '1rem', sm: '1rem' },fontWeight: 400,
              px: { xs: 2, sm: 0 }, letterSpacing: '18px',}} >
            SERVICIOS DIAGNÓSTICOS
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }}  
          sx={{ justifyContent:"center", mb: { xs: 2, sm: 4 } }}
        >
          {services.map((service) => (
            <Grid key={service.title}>
              <ServiceCard elevation={3} onClick={() => navigate(service.path)}>
                {service.icon}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#2f84e4', 
                    mb: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    letterSpacing: '0.5px',
                  }}
                >
                  {service.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    lineHeight: 1.4,
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  {service.description}
                </Typography>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          textAlign: 'center', 
          pb: { xs: 2, sm: 4 } 
        }}>
          <CreatorButton onClick={() => navigate('/creator')}>
            CREATOR
          </CreatorButton>
        </Box>
      </Container>

        </Box>
    );

};

export default Menu;
