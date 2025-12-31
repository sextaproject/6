import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const SOFA = () => {
    const categories = [
        {
            id: 'respiration',
            title: 'Respiración (PaO2/FiO2)',
            options: [
                { label: '≥ 400 (Sano)', value: 0 },
                { label: '< 400', value: 1 },
                { label: '< 300', value: 2 },
                { label: '< 200 (con soporte ventilatorio)', value: 3 },
                { label: '< 100 (con soporte ventilatorio)', value: 4 },
            ]
        },
        {
            id: 'coagulation',
            title: 'Coagulación (Plaquetas x10³/µL)',
            options: [
                { label: '≥ 150', value: 0 },
                { label: '< 150', value: 1 },
                { label: '< 100', value: 2 },
                { label: '< 50', value: 3 },
                { label: '< 20', value: 4 },
            ]
        },
        {
            id: 'liver',
            title: 'Hígado (Bilirrubina mg/dL)',
            options: [
                { label: '< 1.2', value: 0 },
                { label: '1.2 – 1.9', value: 1 },
                { label: '2.0 – 5.9', value: 2 },
                { label: '6.0 – 11.9', value: 3 },
                { label: '> 12.0', value: 4 },
            ]
        },
        {
            id: 'cardio',
            title: 'Cardiovascular (PAM o Vasopresores)',
            options: [
                { label: 'PAM ≥ 70 mmHg', value: 0 },
                { label: 'PAM < 70 mmHg', value: 1 },
                { label: 'Dopamina ≤ 5 o Dobutamina (cualquier dosis)', value: 2 },
                { label: 'Dopamina > 5 o Epinefrina ≤ 0.1 o Norepi ≤ 0.1', value: 3 },
                { label: 'Dopamina > 15 o Epinefrina > 0.1 o Norepi > 0.1', value: 4 },
            ]
        },
        {
            id: 'cns',
            title: 'SNC (Escala de Glasgow)',
            options: [
                { label: '15', value: 0 },
                { label: '13 – 14', value: 1 },
                { label: '10 – 12', value: 2 },
                { label: '6 – 9', value: 3 },
                { label: '< 6', value: 4 },
            ]
        },
        {
            id: 'renal',
            title: 'Renal (Creatinina mg/dL o Flujo Urinario)',
            options: [
                { label: 'Creat < 1.2', value: 0 },
                { label: 'Creat 1.2 – 1.9', value: 1 },
                { label: 'Creat 2.0 – 3.4', value: 2 },
                { label: 'Creat 3.5 – 4.9 (o < 500ml/d)', value: 3 },
                { label: 'Creat > 5.0 (o < 200ml/d)', value: 4 },
            ]
        }
    ];

    const [scores, setScores] = useState({
        respiration: 0, coagulation: 0, liver: 0, cardio: 0, cns: 0, renal: 0
    });

    const handleChange = (id, value) => {
        setScores(prev => ({ ...prev, [id]: parseInt(value) }));
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getMortality = (s) => {
        if (s <= 1) return '< 10%';
        if (s <= 3) return '~20%';
        if (s <= 5) return '~40%';
        if (s <= 7) return '~60%';
        if (s <= 9) return '~80%';
        return '> 90%';
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalHospitalIcon color="primary" fontSize="large" />
                    <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                        SOFA SCORE
                    </Typography>
                </Box>
                <Chip label={`Score: ${totalScore}`} color="primary" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            </Box>

            {categories.map((cat) => (
                <Box key={cat.id} sx={{ mb: 4 }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem', color: 'text.primary' }}>
                            {cat.title}
                        </FormLabel>
                        <RadioGroup value={scores[cat.id]} onChange={(e) => handleChange(cat.id, e.target.value)}>
                            {cat.options.map((opt) => (
                                <FormControlLabel 
                                    key={opt.value} 
                                    value={opt.value} 
                                    control={<Radio size="small" />} 
                                    label={`${opt.label} (+${opt.value})`} 
                                    sx={{ mb: 0.5 }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            ))}

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">Interpretación</Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                    Mortalidad Estimada: {getMortality(totalScore)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Un aumento de ≥2 puntos sugiere disfunción orgánica aguda (Sepsis).
                </Typography>
            </Box>
        </Paper>
    );
};

export default SOFA;