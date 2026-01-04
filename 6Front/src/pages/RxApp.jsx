import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Container, CircularProgress, 
  Card, CardContent, Chip, LinearProgress, Alert, IconButton 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SensorsIcon from '@mui/icons-material/Sensors';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const RxApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. HANDLE IMAGE SELECTION & AUTO-ANALYZE
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
      setLoading(true);

      // Auto-run analysis immediately
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/rx/analyze/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Error analyzing image');

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error(err);
        setError('Error de conexión. ¿Está el servidor activo?');
      } finally {
        setLoading(false);
      }
    }
  };

  // 3. RESET
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#eceff1', pb: 8 }}>
      
      {/* HEADER */}
      <Paper elevation={0} sx={{ pt: '8px', pb: 8, bgcolor: '#263238', color: 'white', borderRadius: '0 0 3rem 3rem' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', paddingTop: '25px'}}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Button
                  component={Link}
                  to="/menu"
                  startIcon={<ArrowBackIcon />}
                  variant="outlined"
                  color="inherit"
                  size="small"
                >
                  Volver al menú
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1,}}>
                <SensorsIcon sx={{ fontSize: 40, color: '#4fc3f7' }} />
                <Typography variant="h3" sx={{ fontFamily: 'Orbitron', fontWeight: 700 }}>
                    RAIDIO
                </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                SISTEMA DE CLASIFICACIÓN DE TÓRAX
            </Typography>
        </Container>
      </Paper>

      <Container maxWidth="md" sx={{ mt: -5 }}>
        <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <CardContent sx={{ p: 4 }}>
                
                {/* UPLOAD ZONE */}
                {!preview ? (
                    <Box 
                        component="label"
                        htmlFor="upload-button"
                        sx={{ 
                            border: '3px dashed #cfd8dc', 
                            borderRadius: 4, 
                            p: 6, 
                            textAlign: 'center',
                            bgcolor: '#fafafa',
                            transition: '0.3s',
                            cursor: 'pointer',
                            display: 'block',
                            '&:hover': { bgcolor: '#f1f8e9', borderColor: '#4caf50' }
                        }}
                    >
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-button"
                            type="file"
                            onChange={handleFileSelect}
                        />
                        <IconButton color="primary" component="span" sx={{ p: 2, bgcolor: '#e3f2fd', mb: 2 }}>
                            <CloudUploadIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                        <Typography variant="h6" color="text.secondary">
                            Arrastra tu Radiografía o haz Click
                        </Typography>
                    </Box>
                ) : (
                    // PREVIEW ZONE
                    <Box sx={{ position: 'relative', textAlign: 'center', bgcolor: 'black', borderRadius: 4, overflow: 'hidden' }}>
                        <img 
                            src={preview} 
                            alt="X-Ray" 
                            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', opacity: loading ? 0.5 : 1, transition: '0.3s' }} 
                        />
                        {loading && (
                            <Box sx={{ 
                                position: 'absolute', 
                                top: '50%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <CircularProgress size={60} sx={{ color: '#4fc3f7' }} />
                                <Typography variant="h6" sx={{ color: 'white', fontFamily: 'Orbitron' }}>
                                    ANALIZANDO...
                                </Typography>
                            </Box>
                        )}
                        <IconButton 
                            onClick={handleClear}
                            disabled={loading}
                            sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'red' } }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                )}

                {/* RESULTS AREA */}
                {result && (
                    <Box sx={{ mt: 4, p: 3, bgcolor: '#e0f7fa', borderRadius: 3, border: '1px solid #4dd0e1', animation: 'fadeIn 0.5s ease' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="bold">
                            INFORME PRELIMINAR
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="h4" fontWeight="800" color="#006064">
                                {result.diagnosis.toUpperCase()}
                            </Typography>
                            <Chip 
                                icon={<CheckCircleIcon />} 
                                label={`Confianza: ${result.confidence}`} 
                                color={parseInt(result.confidence) > 80 ? "success" : "warning"}
                                sx={{ fontSize: '1rem', py: 2 }} 
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">IA Confidence:</Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={parseInt(result.confidence)} 
                                    sx={{ height: 10, borderRadius: 5, bgcolor: '#b2ebf2', '& .MuiLinearProgress-bar': { bgcolor: '#00bcd4' } }} 
                                />
                            </Box>
                        </Box>

                        <Typography variant="caption" sx={{ display: 'block', mt: 3, textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                            * Este resultado es generado por Inteligencia Artificial y no sustituye el criterio de un radiólogo.
                        </Typography>
                    </Box>
                )}

            </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RxApp;