import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper, Card, CardContent, Divider } from '@mui/material';
import { HealthAndSafety, AccessibilityNew, Api, Healing, Send, LocationOn } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CommonBackground = styled(Box)({
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
    linear-gradient(rgb(0 12 39 / 89%), rgb(48 63 116 / 0%)),
    linear-gradient(90deg, rgba(101, 219, 255, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(101, 219, 255, 0.03) 1px, transparent 1px) `,
    backgroundSize: '100% 100%, 40px 40px, 40px 40px',
    zIndex: -1,
     pointerEvents: 'none',
});

function Creator() {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert('Por favor, escribe tu retroalimentación');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/pharmaGo/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: feedback })
      });
      
      if (response.ok) {
        alert('¡Gracias por tu retroalimentación!');
        setFeedback('');
      } else {
        alert('Error al enviar. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 110px)', overflowY: 'auto', pb: 4 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Paper elevation={4} sx={{
                    p: 3, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(101, 219, 255, 0.3)', maxWidth: '900px', mb: 6,  marginBottom:'8px',
                    }}>
                    <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontStyle: 'italic', textAlign: 'center' }}>
                    "He construido Sexta para extender la capacidad diagnóstica médica. Considero que la tecnología debe estar al alcance de todos, ser una herramienta equilibrante."
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'primary.light', fontWeight: 500 }}>
                    — William Arévalo, MD
                    </Typography>
                </Paper>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: { xs: 1, md: 3, alignContent: 'center', } }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', mb: 3, fontWeight: 600 }}>
                        Sobre Sexta
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                        Sexta es el resultado de años de experiencia clínica combinada con innovación tecnológica. 
                        Esta potente herramienta de diagnóstico está diseñada para médicos que buscan aprovechar la inteligencia artificial 
                        para mejorar la atención al paciente.
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Nuestra misión es reducir las desigualdades en salud proporcionando tecnología accesible 
                        para todos los profesionales médicos, independientemente de su ubicación o recursos disponibles.
                    </Typography>
                    </Box>
                </Grid>
            </Grid>
            
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <HealthAndSafety sx={{ fontSize: '2rem', color: 'primary.main', mr: 2 }} />
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            Diagnóstico Asistido por IA
                            </Typography>
                        </Box>
            <Grid container spacing={3} sx={{ mb: 6, justifyContent:'center', }}>
                {[
                    { icon: <AccessibilityNew sx={{ fontSize: '3rem', color: 'primary.main' }} />, title: 'Salud Equitativa', description: 'Reduciendo brechas' },
                    { icon: <Api sx={{ fontSize: '3rem', color: 'primary.main' }} />, title: 'Potencia de IA', description: 'Algoritmos avanzados' },
                    { icon: <Healing sx={{ fontSize: '3rem', color: 'primary.main' }} />, title: 'Apoyo Clínico', description: 'Herramientas diagnósticas' },
                    { icon: <LocationOn sx={{ fontSize: '3rem', color: 'primary.main' }} />, title: 'Alcance Global', description: 'Útil en todo el mundo' },
                ].map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper elevation={3} sx={{
                         p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                         borderRadius: '12px', border: '1px solid rgba(30, 136, 229, 0.2)', backgroundColor: 'background.paper',
                         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                         '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                        }}
                    >
                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                        {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                        </Typography>
                    </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mb: 6 }}>
                <Paper elevation={4} sx={{
                    p: 4, borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adjusted alpha
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(101, 219, 255, 0.3)'
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                    Retroalimentación y Nuevas Ideas
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    Estamos constantemente mejorando Sexta. Tus comentarios y sugerencias son invaluables.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                    <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Comparte tus ideas..." value={feedback} onChange={(e) => setFeedback(e.target.value)}
                        sx={{ mb: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                                '& fieldset': { borderColor: 'rgba(101, 219, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: 'primary.light' },
                                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                            },
                            '& .MuiInputBase-input': { color: 'text.primary' }
                        }}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        endIcon={<Send />} 
                        disabled={loading}
                        sx={{ 
                            backgroundColor: 'primary.main', 
                            '&:hover': { backgroundColor: 'primary.dark' } 
                        }}
                    >
                        {loading ? 'Enviando...' : 'Enviar'}
                    </Button>
                    </form>
                </Paper>
            </Box>

            {/* Footer-like Divider */}
            <Divider sx={{ mb: 2, borderColor: 'rgba(101, 219, 255, 0.2)' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            </Typography>
        </Container>
    </Box>
  );
}

export default Creator;