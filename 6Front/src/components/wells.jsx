import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import AirIcon from '@mui/icons-material/Air'; 

const WellsPE = () => {
    const wellsItems = [
      {
        id: 'dvt_signs',
        title: 'Signos y síntomas clínicos de TVP',
        subtitle: 'Edema de pierna y dolor con la palpación de las venas profundas',
        points: 3.0
      },
      {
        id: 'pe_likely',
        title: 'EP es el diagnóstico #1 o igual de probable',
        subtitle: '¿Es la embolia pulmonar el diagnóstico más probable?',
        points: 3.0
      },
      {
        id: 'hr_100',
        title: 'Frecuencia Cardiaca > 100 lpm',
        subtitle: 'Taquicardia',
        points: 1.5
      },
      {
        id: 'immobilization',
        title: 'Inmovilización o Cirugía reciente',
        subtitle: 'Inmovilización ≥3 días o cirugía en las últimas 4 semanas',
        points: 1.5
      },
      {
        id: 'history',
        title: 'Historia previa de TVP o EP',
        subtitle: 'Antecedentes personales documentados',
        points: 1.5
      },
      {
        id: 'hemoptysis',
        title: 'Hemoptisis',
        subtitle: 'Tos con sangre',
        points: 1.0
      },
      {
        id: 'malignancy',
        title: 'Malignidad (Cáncer)',
        subtitle: 'Tratamiento activo, paliativo o diagnosticado en los últimos 6 meses',
        points: 1.0
      },
    ];

    const [scores, setScores] = useState({
        dvt_signs: 0, pe_likely: 0, hr_100: 0, immobilization: 0, history: 0, hemoptysis: 0, malignancy: 0
    });

    const handleChange = (questionId, value) => {
        setScores(prev => ({
            ...prev,
            [questionId]: parseFloat(value) 
        }));
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getRisk = (score) => {
        if (score <= 1) return { text: 'Riesgo Bajo', desc: 'Probabilidad < 1.3%', color: 'success' };
        if (score <= 6) return { text: 'Riesgo Moderado', desc: 'Probabilidad 16.2%', color: 'warning' };
        return { text: 'Riesgo Alto', desc: 'Probabilidad > 37% (AngioTAC recomendado)', color: 'error' };
    };

    const isPeLikely = totalScore > 4 ? "EP Probable" : "EP Improbable";

    const result = getRisk(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AirIcon color="primary" fontSize="large" />
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                            WELLS SCORE (PE)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                           Embolismo Pulmonar
                        </Typography>
                    </Box>
                </Box>
                
                <Chip 
                    label={`Score: ${totalScore}`} 
                    color={result.color} 
                    sx={{ fontSize: '1.2rem', padding: 2, fontWeight: 'bold' }} 
                />
            </Box>

            {wellsItems.map((item) => (
                <Box key={item.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ maxWidth: '70%' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.subtitle}
                            </Typography>
                        </Box>

                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                value={scores[item.id]}
                                onChange={(e) => handleChange(item.id, e.target.value)}
                            >
                                <FormControlLabel 
                                    value={0} 
                                    control={<Radio size="small" />} 
                                    label="No" 
                                    sx={{ mr: 2 }}
                                />
                                <FormControlLabel 
                                    value={item.points} 
                                    control={<Radio size="small" />} 
                                    label={`Si (+${item.points})`} 
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
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

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed grey' }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Modelo Simplificado (2 niveles):
                    </Typography>
                    <Typography variant="h6" color="primary.dark">
                        {isPeLikely}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default WellsPE;