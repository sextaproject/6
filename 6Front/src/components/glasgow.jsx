import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Glasgow = () => {
    const gcsItems = [
      {
        id: 'eye',
        title: 'Apertura Ocular (Eye Opening)',
        options: [
          { label: '4 - Espontánea (Spontaneous)', value: 4 },
          { label: '3 - A la orden verbal (To sound)', value: 3 },
          { label: '2 - Al dolor / presión (To pressure)', value: 2 },
          { label: '1 - Ninguna (None)', value: 1 },
        ],
      },
      {
        id: 'verbal',
        title: 'Respuesta Verbal (Verbal Response)',
        options: [
          { label: '5 - Orientado y conversando (Oriented)', value: 5 },
          { label: '4 - Desorientado / Confuso (Confused)', value: 4 },
          { label: '3 - Palabras inapropiadas (Words)', value: 3 },
          { label: '2 - Sonidos incomprensibles (Sounds)', value: 2 },
          { label: '1 - Ninguna (None)', value: 1 },
        ],
      },
      {
        id: 'motor',
        title: 'Respuesta Motora (Motor Response)',
        options: [
          { label: '6 - Obedece órdenes (Obey commands)', value: 6 },
          { label: '5 - Localiza el dolor (Localizing)', value: 5 },
          { label: '4 - Flexión normal / Retirada (Normal flexion)', value: 4 },
          { label: '3 - Flexión anormal / Decorticación (Abnormal flexion)', value: 3 },
          { label: '2 - Extensión / Descerebración (Extension)', value: 2 },
          { label: '1 - Ninguna (None)', value: 1 },
        ],
      },
    ];

    const [scores, setScores] = useState({
        eye: 4,     
        verbal: 5, 
        motor: 6
    });

    const handleChange = (questionId, value) => {
        setScores(prev => ({
            ...prev,
            [questionId]: parseInt(value)
        }));
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getSeverity = (score) => {
        if (score >= 13) return { text: 'Trauma Leve (Mild)', desc: 'GCS 13-15', color: 'success' };
        if (score >= 9)  return { text: 'Trauma Moderado (Moderate)', desc: 'GCS 9-12', color: 'warning' };
        return { text: 'Trauma Severo / Coma (Severe)', desc: 'GCS 3-8 (Intubación requerida)', color: 'error' };
    };

    const result = getSeverity(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VisibilityIcon color="primary" fontSize="large" />
                    <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                        GLASGOW COMA SCALE
                    </Typography>
                </Box>
                
                <Chip 
                    label={`Score: ${totalScore}`} 
                    color={result.color} 
                    sx={{ fontSize: '1.2rem', padding: 2, fontWeight: 'bold' }} 
                />
            </Box>

            {gcsItems.map((item) => (
                <Box key={item.id} sx={{ mb: 4 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.1rem', mb: 1 }}>
                            {item.title}
                        </FormLabel>
                        
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
                                    sx={{ mb: 0.5 }} 
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" color="text.secondary">Interpretación</Typography>
                <Typography variant="h4" color={result.color + '.main'} sx={{ fontWeight: 'bold', mt: 1 }}>
                    {result.text}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                    {result.desc}
                </Typography>
                {totalScore <= 8 && (
                    <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
                        ⚠️ Considerar intubación (Rule of 8: "Less than 8, intubate")
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default Glasgow;