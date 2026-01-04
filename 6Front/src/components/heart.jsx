import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const HEART = () => {
    const heartItems = [
      {
        id: 'history',
        title: 'Historia',
        description: 'Sospecha clínica basada en la historia del dolor torácico',
        options: [
          { label: 'Levemente sospechosa', value: 0 },
          { label: 'Moderadamente sospechosa', value: 1 },
          { label: 'Altamente sospechosa', value: 2 },
        ],
      },
      {
        id: 'ecg',
        title: 'Electrocardiograma (ECG)',
        description: 'Hallazgos en el ECG inicial',
        options: [
          { label: 'Normal', value: 0 },
          { label: 'Repolarización inespecífica', value: 1 },
          { label: 'Depresión significativa del ST', value: 2 },
        ],
      },
      {
        id: 'age',
        title: 'Edad (Age)',
        description: 'Edad del paciente al momento del ingreso',
        options: [
          { label: 'Menor de 45 años', value: 0 },
          { label: 'Entre 45 y 64 años', value: 1 },
          { label: '65 años o más', value: 2 },
        ],
      },
      {
        id: 'risk',
        title: 'Factores de Riesgo',
        description: 'HTA, Diabetes, Colesterol alto, Tabaquismo, Obesidad, Historia familiar',
        options: [
          { label: 'Sin factores de riesgo conocidos', value: 0 },
          { label: '1 o 2 factores de riesgo', value: 1 },
          { label: '≥3 factores o historia de enfermedad ateroesclerótica', value: 2 },
        ],
      },
      {
        id: 'troponin',
        title: 'Troponina',
        description: 'Niveles iniciales de troponina',
        options: [
          { label: '≤ Límite normal', value: 0 },
          { label: '1–3x Límite normal', value: 1 },
          { label: '>3x Límite normal', value: 2 },
        ],
      },
    ];

    const [scores, setScores] = useState({
        history: 0, ecg: 0, age: 0, risk: 0, troponin: 0
    });

    const handleChange = (questionId, value) => {
        setScores(prev => ({
            ...prev,
            [questionId]: parseInt(value)
        }));
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getRisk = (score) => {
        if (score <= 3) return { text: 'Bajo Riesgo (0-3)', desc: 'Recomendación: Alta posible', color: 'success' };
        if (score <= 6) return { text: 'Riesgo Moderado (4-6)', desc: 'Recomendación: Observación / Troponinas seriadas', color: 'warning' };
        return { text: 'Alto Riesgo (7-10)', desc: 'Recomendación: Tratamiento invasivo temprano', color: 'error' };
    };

    const result = getRisk(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FavoriteIcon color="error" fontSize="large" />
                    <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                        HEART SCORE
                    </Typography>
                </Box>
                
                <Chip 
                    label={`Score: ${totalScore}`} 
                    color={result.color} 
                    sx={{ fontSize: '1.2rem', padding: 2, fontWeight: 'bold' }} 
                />
            </Box>

            {heartItems.map((item) => (
                <Box key={item.id} sx={{ mb: 4 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.1rem' }}>
                            {item.title}
                        </FormLabel>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            {item.description}
                        </Typography>
                        
                        <RadioGroup
                            value={scores[item.id]}
                            onChange={(e) => handleChange(item.id, e.target.value)}
                        >
                            {item.options.map((option) => (
                                <FormControlLabel 
                                    key={option.value} 
                                    value={option.value} 
                                    control={<Radio />} 
                                    label={option.label}
                                    sx={{ mb: 1 }} 
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: '#fff3f3', p: 3, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'error.light' }}>
                <Typography variant="h6" color="text.secondary">Interpretación</Typography>
                <Typography variant="h4" color={result.color + '.main'} sx={{ fontWeight: 'bold', mt: 1 }}>
                    {result.text}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                    {result.desc}
                </Typography>
            </Box>
        </Paper>
    );
};
export default HEART;
