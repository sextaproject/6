import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt'; 

const ChadsVasc = () => {
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState(0);
    const [history, setHistory] = useState({
        chf: 0,
        htn: 0,
        diabetes: 0,
        stroke: 0,
        vascular: 0
    });

    const handleHistoryChange = (key, val) => {
        setHistory(prev => ({ ...prev, [key]: parseInt(val) }));
    };

    const totalScore = age + sex + Object.values(history).reduce((a, b) => a + b, 0);

    const getRisk = (score, isFemale) => {
        const baseline = isFemale ? 1 : 0;
        
        if (score === baseline) {
            return { 
                text: 'Riesgo Bajo (0)', 
                desc: 'No se recomienda anticoagulación.', 
                color: 'success' 
            };
        }
        if (score === baseline + 1) {
            return { 
                text: 'Riesgo Moderado (1)', 
                desc: 'Considerar anticoagulación oral (preferible a aspirina).', 
                color: 'warning' 
            };
        }
        return { 
            text: 'Alto Riesgo (≥2)', 
            desc: 'Se recomienda anticoagulación oral fuerte.', 
            color: 'error' 
        };
    };

    const result = getRisk(totalScore, sex === 1);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BoltIcon color="primary" fontSize="large" />
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                            CHA₂DS₂-VASc
                        </Typography>
                        <Typography variant="caption">Atrial Fibrillation Stroke Risk</Typography>
                    </Box>
                </Box>
                <Chip label={`Score: ${totalScore}`} color={result.color} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            </Box>

            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                
                <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Edad (Age)</FormLabel>
                    <RadioGroup row value={age} onChange={(e) => setAge(parseInt(e.target.value))}>
                        <FormControlLabel value={0} control={<Radio />} label="< 65" />
                        <FormControlLabel value={1} control={<Radio />} label="65 – 74 (+1)" />
                        <FormControlLabel value={2} control={<Radio />} label="≥ 75 (+2)" />
                    </RadioGroup>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Sexo</FormLabel>
                    <RadioGroup row value={sex} onChange={(e) => setSex(parseInt(e.target.value))}>
                        <FormControlLabel value={0} control={<Radio />} label="Masculino" />
                        <FormControlLabel value={1} control={<Radio />} label="Femenino (+1)" />
                    </RadioGroup>
                </FormControl>
            </Box>

            <BinaryRow 
                title="C - Insuficiencia Cardíaca" 
                subtitle="Historia de ICC o disfunción VI" 
                points={1} 
                value={history.chf} 
                onChange={(v) => handleHistoryChange('chf', v)} 
            />

            <BinaryRow 
                title="H - Hipertensión" 
                subtitle="Tratada o consistente > 140/90" 
                points={1} 
                value={history.htn} 
                onChange={(v) => handleHistoryChange('htn', v)} 
            />

            <BinaryRow 
                title="D - Diabetes Mellitus" 
                subtitle="Tratada con dieta o medicación" 
                points={1} 
                value={history.diabetes} 
                onChange={(v) => handleHistoryChange('diabetes', v)} 
            />

            <BinaryRow 
                title="S₂ - Stroke / TIA" 
                subtitle="Historia de Ictus, AIT o Tromboembolismo" 
                points={2} 
                value={history.stroke} 
                onChange={(v) => handleHistoryChange('stroke', v)} 
            />

            <BinaryRow 
                title="V - Enfermedad Vascular" 
                subtitle="Infarto previo, enfermedad arterial periférica o placa aórtica" 
                points={1} 
                value={history.vascular} 
                onChange={(v) => handleHistoryChange('vascular', v)} 
            />

            <Box sx={{ mt: 3, textAlign: 'center', p: 2, border: '1px solid', borderColor: result.color + '.main', borderRadius: 2 }}>
                <Typography variant="h5" color={result.color + '.main'} fontWeight="bold">
                    {result.text}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {result.desc}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Riesgo Anual de Ictus (sin Tx): {getStrokeRate(totalScore)}%
                </Typography>
            </Box>
        </Paper>
    );
};

// Helper Component for Yes/No rows to keep code clean
const BinaryRow = ({ title, subtitle, points, value, onChange }) => (
    <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ maxWidth: '70%' }}>
                <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Box>
            <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
                <FormControlLabel value={0} control={<Radio size="small" />} label="No" />
                <FormControlLabel value={points} control={<Radio size="small" />} label={`Sí (+${points})`} />
            </RadioGroup>
        </Box>
        <Divider sx={{ mt: 1 }} />
    </Box>
);

// Helper for statistic
const getStrokeRate = (score) => {
    const rates = { 0: 0, 1: 1.3, 2: 2.2, 3: 3.2, 4: 4.0, 5: 6.7, 6: 9.8, 7: 9.6, 8: 6.7, 9: 15.2 };
    return rates[score] || '>15';
};

export default ChadsVasc;