import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import MasksIcon from '@mui/icons-material/Masks'; 

const Curb65 = () => {
    const items = [
      { id: 'C', title: 'Confusion', subtitle: 'Desorientación nueva en tiempo, lugar o persona', points: 1 },
      { id: 'U', title: 'Urea (BUN)', subtitle: '> 19 mg/dL (> 7 mmol/L)', points: 1 },
      { id: 'R', title: 'Respiratory Rate', subtitle: '≥ 30 rpm', points: 1 },
      { id: 'B', title: 'Blood Pressure', subtitle: 'TAS < 90 mmHg o TAD ≤ 60 mmHg', points: 1 },
      { id: '65', title: 'Age ≥ 65', subtitle: 'Edad 65 años o más', points: 1 },
    ];

    const [scores, setScores] = useState({ C: 0, U: 0, R: 0, B: 0, '65': 0 });

    const handleChange = (id, value) => {
        setScores(prev => ({ ...prev, [id]: parseInt(value) }));
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const getResult = (score) => {
        if (score <= 1) return { 
            text: 'Riesgo Bajo', 
            desc: 'Mortalidad < 3%. Considerar tratamiento ambulatorio.', 
            color: 'success' 
        };
        if (score === 2) return { 
            text: 'Riesgo Moderado', 
            desc: 'Mortalidad ~9%. Considerar hospitalización corta o supervisada.', 
            color: 'warning' 
        };
        return { 
            text: 'Riesgo Alto', 
            desc: 'Mortalidad 15-40%. Ingreso hospitalario. Considerar UCI si Score ≥ 4.', 
            color: 'error' 
        };
    };

    const result = getResult(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MasksIcon color="primary" fontSize="large" />
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                            CURB-65
                        </Typography>
                        <Typography variant="caption">Pneumonia Severity</Typography>
                    </Box>
                </Box>
                <Chip label={`Score: ${totalScore}`} color={result.color} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            </Box>

            {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ maxWidth: '75%' }}>
                            <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>
                        </Box>
                        <RadioGroup row value={scores[item.id]} onChange={(e) => handleChange(item.id, e.target.value)}>
                            <FormControlLabel value={0} control={<Radio size="small" />} label="No" />
                            <FormControlLabel value={1} control={<Radio size="small" />} label="Sí" />
                        </RadioGroup>
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, textAlign: 'center', mt: 2 }}>
                <Typography variant="h5" color={result.color + '.main'} fontWeight="bold">{result.text}</Typography>
                <Typography variant="body1">{result.desc}</Typography>
            </Box>
        </Paper>
    );
};

export default Curb65;