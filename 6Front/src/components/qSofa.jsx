import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const QSOFA = () => {
    const items = [
      {
        id: 'mental',
        title: 'Estado Mental Alterado',
        subtitle: 'GCS < 15',
        points: 1
      },
      {
        id: 'respiratory',
        title: 'Frecuencia Respiratoria',
        subtitle: '≥ 22 rpm',
        points: 1
      },
      {
        id: 'bp',
        title: 'Presión Arterial Sistólica',
        subtitle: '≤ 100 mmHg',
        points: 1
      },
    ];

    const [scores, setScores] = useState({ mental: 0, respiratory: 0, bp: 0 });

    const handleChange = (id, value) => {
        setScores(prev => ({ ...prev, [id]: parseInt(value) }));
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const getResult = (score) => {
        if (score >= 2) return { 
            text: 'Alto Riesgo (Sepsis)', 
            desc: 'Mortalidad hospitalaria elevada. Evaluar lactato y buscar infección.', 
            color: 'error' 
        };
        return { 
            text: 'Bajo Riesgo', 
            desc: 'Monitorizar. No descarta sepsis si la sospecha es alta.', 
            color: 'success' 
        };
    };

    const result = getResult(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WarningAmberIcon color="error" fontSize="large" />
                    <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                        qSOFA
                    </Typography>
                </Box>
                <Chip label={`Score: ${totalScore}`} color={result.color} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            </Box>

            {items.map((item) => (
                <Box key={item.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>
                        </Box>
                        <RadioGroup row value={scores[item.id]} onChange={(e) => handleChange(item.id, e.target.value)}>
                            <FormControlLabel value={0} control={<Radio />} label="No" />
                            <FormControlLabel value={1} control={<Radio />} label="Sí (+1)" />
                        </RadioGroup>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h5" color={result.color + '.main'} fontWeight="bold">{result.text}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>{result.desc}</Typography>
            </Box>
        </Paper>
    );
};

export default QSOFA;