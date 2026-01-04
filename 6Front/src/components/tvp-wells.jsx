import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import AirlineSeatLegroomExtraIcon from '@mui/icons-material/AirlineSeatLegroomExtra'; 

const TVPWells = () => {
    const dvtItems = [
      {
        id: 'cancer',
        title: 'Cáncer activo',
        subtitle: 'Tratamiento en los últimos 6 meses o paliativo',
        points: 1
      },
      {
        id: 'paralysis',
        title: 'Parálisis, paresia o inmovilización',
        subtitle: 'Reciente inmovilización con yeso en miembros inferiores',
        points: 1
      },
      {
        id: 'bedridden',
        title: 'Encamamiento reciente > 3 días',
        subtitle: 'O cirugía mayor en las últimas 12 semanas',
        points: 1
      },
      {
        id: 'tenderness',
        title: 'Dolor localizado',
        subtitle: 'A lo largo de la distribución del sistema venoso profundo',
        points: 1
      },
      {
        id: 'swelling_leg',
        title: 'Edema en toda la pierna',
        subtitle: 'Hinchazón generalizada del miembro afectado',
        points: 1
      },
      {
        id: 'swelling_calf',
        title: 'Edema de pantorrilla > 3 cm',
        subtitle: 'Comparado con el lado asintomático (medido 10cm bajo tuberosidad tibial)',
        points: 1
      },
      {
        id: 'pitting',
        title: 'Edema con fóvea (Pitting edema)',
        subtitle: 'Confinado a la pierna sintomática',
        points: 1
      },
      {
        id: 'veins',
        title: 'Venas superficiales colaterales',
        subtitle: 'No varicosas',
        points: 1
      },
      {
        id: 'history',
        title: 'Historia previa de TVP',
        subtitle: 'Trombosis venosa profunda documentada anteriormente',
        points: 1
      },
      {
        id: 'alternative',
        title: 'Diagnóstico alternativo más probable',
        subtitle: '¿Es otro diagnóstico (ej. celulitis, trauma) al menos tan probable como TVP?',
        points: -2 
      },
    ];

    const [scores, setScores] = useState({
        cancer: 0, paralysis: 0, bedridden: 0, tenderness: 0, swelling_leg: 0,
        swelling_calf: 0, pitting: 0, veins: 0, history: 0, alternative: 0
    });

    const handleChange = (questionId, value) => {
        setScores(prev => ({
            ...prev,
            [questionId]: parseInt(value)
        }));
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getRisk = (score) => {
        if (score <= 0) return { text: 'Riesgo Bajo', desc: 'Probabilidad ~5%', color: 'success' };
        if (score <= 2) return { text: 'Riesgo Moderado', desc: 'Probabilidad ~17%', color: 'warning' };
        return { text: 'Riesgo Alto', desc: 'Probabilidad ~53% (Eco Doppler urgente)', color: 'error' };
    };

    const isDvtLikely = totalScore >= 2 ? "TVP Probable" : "TVP Improbable";
    const result = getRisk(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AirlineSeatLegroomExtraIcon color="primary" fontSize="large" />
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                            WELLS SCORE (DVT)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                           Trombosis Venosa Profunda
                        </Typography>
                    </Box>
                </Box>
                
                <Chip 
                    label={`Score: ${totalScore}`} 
                    color={result.color} 
                    sx={{ fontSize: '1.2rem', padding: 2, fontWeight: 'bold' }} 
                />
            </Box>

            {dvtItems.map((item) => (
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
                                    label={`Si (${item.points > 0 ? '+' : ''}${item.points})`} 
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>                
                <Typography variant="h4" color={result.color + '.main'} sx={{ fontWeight: 'bold', mt: 1 }}>
                    {result.text}
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                    {result.desc}
                </Typography>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed grey' }}>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Modelo Simplificado:
                    </Typography>
                    <Typography variant="h6" color="primary.dark">
                        {isDvtLikely}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default TVPWells;