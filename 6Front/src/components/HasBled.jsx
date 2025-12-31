import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const HasBled = () => {
    const items = [
      { id: 'H', title: 'Hipertensión', subtitle: 'Sistólica > 160 mmHg no controlada', points: 1 },
      { id: 'A1', title: 'Función Renal Anormal', subtitle: 'Diálisis, trasplante o Cr > 2.26 mg/dL', points: 1 },
      { id: 'A2', title: 'Función Hepática Anormal', subtitle: 'Cirrosis o Bilirrubina > 2x / AST/ALT > 3x', points: 1 },
      { id: 'S', title: 'Stroke (ACV)', subtitle: 'Historia previa de ictus', points: 1 },
      { id: 'B', title: 'Bleeding (Sangrado)', subtitle: 'Historia de sangrado mayor o predisposición', points: 1 },
      { id: 'L', title: 'Labile INR', subtitle: 'INR inestable/alto o <60% tiempo en rango', points: 1 },
      { id: 'E', title: 'Elderly (Edad > 65)', subtitle: 'Paciente mayor de 65 años', points: 1 },
      { id: 'D1', title: 'Drogas / Fármacos', subtitle: 'Antiplaquetarios o AINEs', points: 1 },
      { id: 'D2', title: 'Alcohol', subtitle: '≥ 8 tragos/semana', points: 1 },
    ];

    const [scores, setScores] = useState(
        items.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
    );

    const handleChange = (id, value) => {
        setScores(prev => ({ ...prev, [id]: parseInt(value) }));
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const getResult = (score) => {
        if (score >= 3) return { 
            text: 'Alto Riesgo', 
            desc: 'Bleeding Risk > 5.8% / año. Precaución y monitoreo regular.', 
            color: 'error' 
        };
        return { 
            text: 'Riesgo Bajo / Moderado', 
            desc: 'Bleeding Risk < 4% / año.', 
            color: 'success' 
        };
    };

    const result = getResult(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BloodtypeIcon color="error" fontSize="large" />
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                            HAS-BLED
                        </Typography>
                        <Typography variant="caption">Bleeding Risk in A-Fib</Typography>
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

export default HasBled;