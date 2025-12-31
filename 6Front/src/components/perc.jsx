import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'; 

const PERC = () => {
    const percItems = [
      {
        id: 'age',
        title: 'Edad ≥ 50 años',
        subtitle: '¿El paciente tiene 50 años o más?',
      },
      {
        id: 'hr',
        title: 'Frecuencia Cardiaca ≥ 100 lpm',
        subtitle: 'Taquicardia en el momento del examen',
      },
      {
        id: 'sats',
        title: 'Saturación de Oxígeno < 95%',
        subtitle: 'Aire ambiente',
      },
      {
        id: 'swelling',
        title: 'Hinchazón unilateral de pierna',
        subtitle: 'Sospecha visual o palpable de TVP',
      },
      {
        id: 'hemoptysis',
        title: 'Hemoptisis',
        subtitle: 'Tos con sangre',
      },
      {
        id: 'surgery',
        title: 'Cirugía o Trauma reciente',
        subtitle: 'En las últimas 4 semanas (requiriendo hospitalización o anestesia)',
      },
      {
        id: 'history',
        title: 'Historia previa de TVP o EP',
        subtitle: 'Antecedentes personales documentados',
      },
      {
        id: 'hormones',
        title: 'Uso de Hormonas exógenas',
        subtitle: 'Anticonceptivos orales, reemplazo hormonal o estrógenos',
      },
    ];

    const [scores, setScores] = useState({
        age: 0, hr: 0, sats: 0, swelling: 0, 
        hemoptysis: 0, surgery: 0, history: 0, hormones: 0
    });

    const handleChange = (id, value) => {
        setScores(prev => ({ ...prev, [id]: parseInt(value) }));
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getResult = (score) => {
        if (score === 0) return { 
            text: 'PE RULED OUT (< 2%)', 
            desc: 'No se requiere D-Dimer ni imagenología si la gestalt inicial era baja.', 
            color: 'success' 
        };
        return { 
            text: 'REGLA NO CUMPLIDA', 
            desc: 'No se puede descartar TEP solo con clínica. Considere D-Dimer o Wells.', 
            color: 'error' 
        };
    };

    const result = getResult(totalScore);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <HealthAndSafetyIcon color="primary" fontSize="large" />
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                            PERC RULE
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                           Pulmonary Embolism Rule-out Criteria
                        </Typography>
                    </Box>
                </Box>
                
                <Chip 
                    label={`Criteria Met: ${totalScore}`} 
                    color={result.color} 
                    sx={{ fontSize: '1.2rem', padding: 2, fontWeight: 'bold' }} 
                />
            </Box>

            <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2, borderLeft: '4px solid #ff9800' }}>
                <Typography variant="body2" color="warning.dark">
                    <strong>Nota:</strong> Use solo si la sospecha clínica (Gestalt) es <strong>BAJA</strong>.
                </Typography>
            </Box>

            {percItems.map((item) => (
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

                        <RadioGroup
                            row
                            value={scores[item.id]}
                            onChange={(e) => handleChange(item.id, e.target.value)}
                        >
                            <FormControlLabel value={0} control={<Radio size="small" />} label="No" sx={{ mr: 2 }} />
                            <FormControlLabel value={1} control={<Radio size="small" />} label="Sí" />
                        </RadioGroup>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">Interpretación</Typography>
                
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

export default PERC;