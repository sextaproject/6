import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, InputAdornment, Grid, Chip, Alert, Divider } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const AcidBase = () => {
    const [ph, setPh] = useState('');
    const [paco2, setPaco2] = useState('');
    const [hco3, setHco3] = useState('');
    const [po2, setPo2] = useState('');
    const [na, setNa] = useState(''); 
    const [cl, setCl] = useState(''); 
    const [fio2, setFio2] = useState('21'); 

    const [diagnosis, setDiagnosis] = useState(null);
    const [compensation, setCompensation] = useState(null);
    const [anionGap, setAnionGap] = useState(null);
    const [oxygenation, setOxygenation] = useState(null);
    const [consistency, setConsistency] = useState(true); 

    useEffect(() => {
        const p = parseFloat(ph);
        const c = parseFloat(paco2);
        const b = parseFloat(hco3);
        const o2 = parseFloat(po2);
        const n = parseFloat(na);
        const chloride = parseFloat(cl);
        const fi = parseFloat(fio2);

        if (p > 0 && c > 0 && b > 0) {
            const isAcidotic = p < 7.35;
            const isAlkalotic = p > 7.45;
            let diag = '';
            let comp = '';

            if (p >= 7.35 && p <= 7.45) {
                if (c > 45 && b > 26) diag = 'Fully Compensated Respiratory Acidosis or Metabolic Alkalosis';
                else if (c < 35 && b < 22) diag = 'Fully Compensated Respiratory Alkalosis or Metabolic Acidosis';
                else diag = 'Normal Acid-Base Status';
            } else if (isAcidotic) {
                if (c > 45 && b < 22) {
                    diag = 'Mixed Respiratory & Metabolic Acidosis (Critical!)';
                } else if (c > 45) {
                    diag = 'Respiratory Acidosis';
                    const co2Change = c - 40;
                    const expectedBicarbAcute = 24 + (co2Change / 10 * 1);
                    const expectedBicarbChronic = 24 + (co2Change / 10 * 3.5);
                    
                    if (Math.abs(b - expectedBicarbAcute) < 2) comp = 'Acute Phase';
                    else if (Math.abs(b - expectedBicarbChronic) < 2) comp = 'Chronic Phase';
                    else comp = 'Partially Compensated';

                } else if (b < 22) {
                    diag = 'Metabolic Acidosis';
                    const expectedCo2 = (1.5 * b) + 8;
                    if (c < expectedCo2 - 2) comp = 'with Concomitant Respiratory Alkalosis';
                    else if (c > expectedCo2 + 2) comp = 'with Concomitant Respiratory Acidosis';
                    else comp = 'Respiratory Compensation Adequate (Winter\'s Formula Met)';
                } else {
                    diag = 'Unclassified Acidosis (Check Data)';
                }
            } else {
                if (c < 35 && b > 26) {
                    diag = 'Mixed Respiratory & Metabolic Alkalosis';
                } else if (c < 35) {
                    diag = 'Respiratory Alkalosis';
                    const co2Change = 40 - c;
                    const expBicarbAcute = 24 - (co2Change / 10 * 2);
                    const expBicarbChronic = 24 - (co2Change / 10 * 4);
                     
                    if (Math.abs(b - expBicarbAcute) < 2) comp = 'Acute Phase';
                    else if (Math.abs(b - expBicarbChronic) < 2) comp = 'Chronic Phase';
                    else comp = 'Partially Compensated';

                } else if (b > 26) {
                    diag = 'Metabolic Alkalosis';
                    const rise = b - 24;
                    const expCo2 = (0.7 * rise) + 40;
                    if (c < expCo2 - 5) comp = 'with Concomitant Respiratory Alkalosis';
                    else if (c > expCo2 + 5) comp = 'with Concomitant Respiratory Acidosis';
                    else comp = 'Respiratory Compensation Adequate';
                }
            }
            
            setDiagnosis(diag);
            setCompensation(comp);

            if (n > 0 && chloride > 0) {
                const ag = n - (chloride + b);
                let agText = `${ag.toFixed(1)} mEq/L`;
                if (ag > 12) agText += ' (High Anion Gap)';
                else agText += ' (Normal Anion Gap)';
                setAnionGap(agText);
            } else {
                setAnionGap(null);
            }

            if (o2 > 0) {
                const pf = o2 / (fi / 100);
                let oxStatus = `P/F Ratio: ${Math.round(pf)}`;
                
                if (pf < 200) oxStatus += ' (Moderate ARDS criteria)';
                else if (pf < 300) oxStatus += ' (Mild ARDS / ALI)';
                else if (pf > 400) oxStatus += ' (Normal Gas Exchange)';
                
                if (o2 < 60) oxStatus += ' | SEVERE HYPOXEMIA';
                else if (o2 < 80) oxStatus += ' | Mild Hypoxemia';
                
                setOxygenation(oxStatus);
            } else {
                setOxygenation(null);
            }

            const calcH = 24 * (c / b);
            const expectedPh = -Math.log10(calcH * 1e-9); 
            if (p < 7.35 && c <= 45 && b >= 22) setConsistency(false);
            else if (p > 7.45 && c >= 35 && b <= 26) setConsistency(false);
            else setConsistency(true);

        } else {
            setDiagnosis(null);
            setCompensation(null);
            setAnionGap(null);
            setOxygenation(null);
        }

    }, [ph, paco2, hco3, po2, na, cl, fio2]);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <ScienceIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                    <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                        ABG ANALYZER
                    </Typography>
                    <Typography variant="caption">Arterial Blood Gas Interpretation</Typography>
                </Box>
            </Box>

            {!consistency && (
                 <Alert severity="warning" sx={{ mb: 3 }}>
                    <strong>Consistency Check:</strong> The entered pH values do not physiologically match the pCO2 and HCO3. Please check your inputs.
                 </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                        BLOOD GAS VALUES
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="pH"
                            type="number"
                            size="small"
                            value={ph}
                            onChange={(e) => setPh(e.target.value)}
                            slotProps={{ input: { htmlInput: { step: 0.01, min: 6.8, max: 7.8 } } }}
                        />
                        <TextField
                            label="PaCO2"
                            type="number"
                            size="small"
                            value={paco2}
                            onChange={(e) => setPaco2(e.target.value)}
                            slotProps={{ input: { endAdornment: <InputAdornment position="end">mmHg</InputAdornment> } }}
                        />
                        <TextField
                            label="HCO3"
                            type="number"
                            size="small"
                            value={hco3}
                            onChange={(e) => setHco3(e.target.value)}
                            slotProps={{ input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> } }}
                        />
                         <TextField
                            label="PaO2"
                            type="number"
                            size="small"
                            value={po2}
                            onChange={(e) => setPo2(e.target.value)}
                            slotProps={{ input: { endAdornment: <InputAdornment position="end">mmHg</InputAdornment> } }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                        OPTIONAL (ELECTROLYTES / FiO2)
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Na+ (Sodium)"
                            type="number"
                            size="small"
                            value={na}
                            placeholder="For Anion Gap"
                            onChange={(e) => setNa(e.target.value)}
                        />
                        <TextField
                            label="Cl- (Chloride)"
                            type="number"
                            size="small"
                            value={cl}
                            placeholder="For Anion Gap"
                            onChange={(e) => setCl(e.target.value)}
                        />
                        <TextField
                            label="FiO2 (%)"
                            type="number"
                            size="small"
                            value={fio2}
                            helperText="Room Air = 21%"
                            onChange={(e) => setFio2(e.target.value)}
                            slotProps={{ input: { endAdornment: <InputAdornment position="end">%</InputAdornment> } }}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {diagnosis ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="overline" color="text.secondary">PRIMARY DIAGNOSIS</Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 1, fontFamily: 'Orbitron' }}>
                        {diagnosis}
                    </Typography>

                    {compensation && (
                        <Chip 
                            icon={<ThermostatIcon />} 
                            label={compensation} 
                            color={compensation.includes('Adequate') || compensation.includes('Acute') ? 'success' : 'warning'}
                            sx={{ mt: 1, fontSize: '1rem', py: 2 }}
                        />
                    )}

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                        
                        {anionGap && (
                            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, minWidth: 150 }}>
                                <Typography variant="caption" fontWeight="bold">ANION GAP</Typography>
                                <Typography variant="h6" color="primary.dark">{anionGap}</Typography>
                            </Box>
                        )}

                        {oxygenation && (
                            <Box sx={{ p: 2, bgcolor: '#e0f2f1', borderRadius: 2, minWidth: 150 }}>
                                <Typography variant="caption" fontWeight="bold">OXYGENATION</Typography>
                                <Typography variant="h6" color="teal">{oxygenation}</Typography>
                            </Box>
                        )}
                    </Box>

                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', py: 4, opacity: 0.5 }}>
                    <Typography variant="h6">Enter pH, PaCO2, and HCO3 to interpret.</Typography>
                </Box>
            )}

        </Paper>
    );
};

export default AcidBase;