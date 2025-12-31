import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Container, CircularProgress, 
  Card, CardContent, Chip, LinearProgress, Alert, IconButton 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SensorsIcon from '@mui/icons-material/Sensors'; // AI Icon
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
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

  // 1. HANDLE IMAGE SELECTION
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Create local preview URL
      setResult(null); // Reset previous results
      setError('');
    }
  };

  // 2. SEND TO DJANGO
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    // Prepare the form data (Must use FormData for files)
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/rx/analyze/', {
        method: 'POST',
        body: formData, // No headers needed, browser detects multipart
      });

      if (!response.ok) throw new Error('Error analyzing image');

      const data = await response.json();
      
      // Simulate a small delay for dramatic effect if response is too fast
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error(err);
      setError('Connection failed. Is Django running?');
      setLoading(false);
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
      <Paper elevation={0} sx={{ pt: 6, pb: 8, bgcolor: '#263238', color: 'white', borderRadius: '0 0 3rem 3rem' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
                <SensorsIcon sx={{ fontSize: 40, color: '#4fc3f7' }} />
                <Typography variant="h3" sx={{ fontFamily: 'Orbitron', fontWeight: 700 }}>
                    AI RADIOLOGIST
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
                        sx={{ 
                            border: '3px dashed #cfd8dc', 
                            borderRadius: 4, 
                            p: 6, 
                            textAlign: 'center',
                            bgcolor: '#fafafa',
                            transition: '0.3s',
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
                        <label htmlFor="upload-button">
                            <IconButton color="primary" component="span" sx={{ p: 2, bgcolor: '#e3f2fd', mb: 2 }}>
                                <CloudUploadIcon sx={{ fontSize: 40 }} />
                            </IconButton>
                            <Typography variant="h6" color="text.secondary">
                                Arrastra tu Radiografía o haz Click
                            </Typography>
                            <Button variant="contained" component="span" sx={{ mt: 2, px: 4, borderRadius: 20 }}>
                                Seleccionar Archivo
                            </Button>
                        </label>
                    </Box>
                ) : (
                    // PREVIEW ZONE
                    <Box sx={{ position: 'relative', textAlign: 'center', bgcolor: 'black', borderRadius: 4, overflow: 'hidden' }}>
                        <img 
                            src={preview} 
                            alt="X-Ray" 
                            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
                        />
                        <IconButton 
                            onClick={handleClear}
                            sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'red' } }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}

                {/* ACTION BUTTONS */}
                {preview && !result && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={handleAnalyze}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            sx={{ 
                                bgcolor: '#263238', 
                                px: 6, py: 1.5, 
                                borderRadius: 20, 
                                fontSize: '1.1rem',
                                '&:hover': { bgcolor: 'black' }
                            }}
                        >
                            {loading ? "ANALIZANDO..." : "EJECUTAR DIAGNÓSTICO AI"}
                        </Button>
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