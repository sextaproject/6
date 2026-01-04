import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, InputAdornment, Grid, Divider, Chip } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt'; 

const Electro = () => {    
    const [ca, setCa] = useState('');
    const [alb, setAlb] = useState('');
    const [corrCa, setCorrCa] = useState(null);

    const [na, setNa] = useState('');
    const [gluc, setGluc] = useState('');
    const [corrNa, setCorrNa] = useState(null);

    const [cl, setCl] = useState('');
    const [corrCl, setCorrCl] = useState(null);

    const [k, setK] = useState('');
    const [ph, setPh] = useState('');
    const [corrK, setCorrK] = useState(null);


    useEffect(() => {
        const c = parseFloat(ca);
        const a = parseFloat(alb);
        if (c > 0 && a > 0) {
            const val = c + 0.8 * (4.0 - a);
            setCorrCa(val.toFixed(2));
        } else { setCorrCa(null); }
    }, [ca, alb]);

    useEffect(() => {
        const n = parseFloat(na);
        const g = parseFloat(gluc);
        if (n > 0 && g > 0) {
            const factor = g > 100 ? (g - 100) * 0.016 : 0;
            const val = n + factor;
            setCorrNa(val.toFixed(1));
        } else { setCorrNa(null); }
    }, [na, gluc]);

    useEffect(() => {
        const c = parseFloat(cl);
        const n = parseFloat(na);
        if (c > 0 && n > 0) {
            const val = c * (140 / n);
            setCorrCl(val.toFixed(1));
        } else { setCorrCl(null); }
    }, [cl, na]);

    useEffect(() => {
        const pot = parseFloat(k);
        const p = parseFloat(ph);
        if (pot > 0 && p > 0) {
            const phDiff = 7.4 - p; 
            const change = (phDiff / 0.1) * 0.6;
            const val = pot - change;
            setCorrK(val.toFixed(1));
        } else { setCorrK(null); }
    }, [k, ph]);


    const ResultBox = ({ label, value, unit, desc }) => (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                {label}
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">{unit}</Typography>
            {desc && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{desc}</Typography>}
        </Box>
    );

    return (
        <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, justifyContent: 'center' }}>
                <BoltIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" color="primary" sx={{ fontFamily: 'Orbitron' }}>
                    ELECTROLITOS
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            1. Calcio (Albumina)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Calcio Total"
                                type="number"
                                size="small"
                                value={ca}
                                onChange={(e) => setCa(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> } }}
                            />
                            <TextField
                                label="Albumina"
                                type="number"
                                size="small"
                                value={alb}
                                onChange={(e) => setAlb(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">g/dL</InputAdornment> } }}
                            />
                            {corrCa && <ResultBox label="Calcio Corregido" value={corrCa} unit="mg/dL" desc="Si Albumina < 4.0" />}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            2. Sodio (Glucosa)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Sodio (Na)"
                                type="number"
                                size="small"
                                value={na}
                                onChange={(e) => setNa(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> } }}
                            />
                            <TextField
                                label="Glucosa"
                                type="number"
                                size="small"
                                value={gluc}
                                onChange={(e) => setGluc(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> } }}
                            />
                            {corrNa && <ResultBox label="Sodio Corregido" value={corrNa} unit="mEq/L" desc="Factor de Corrección: 1.6 por 100mg glucosa" />}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            3. Cloro (Sodio)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Cloro (Cl)"
                                type="number"
                                size="small"
                                value={cl}
                                onChange={(e) => setCl(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> } }}
                            />
                             <TextField
                                label="Sodio (Na)"
                                type="number"
                                size="small"
                                value={na}
                                onChange={(e) => setNa(e.target.value)}
                                helperText={na ? "" : "Ingresa los valores"}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> } }}
                            />
                            {corrCl && <ResultBox label="Corrected Chloride" value={corrCl} unit="mEq/L" desc="Normalized to Na 140" />}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            4. Potasio (pH)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Potasio (K)"
                                type="number"
                                size="small"
                                value={k}
                                onChange={(e) => setK(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> } }}
                            />
                             <TextField
                                label="pH"
                                type="number"
                                size="small"
                                value={ph}
                                onChange={(e) => setPh(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">mmHg</InputAdornment> } }}
                            />
                            {corrK && <ResultBox label="Estimado K con pH 7.4" value={corrK} unit="mEq/L" desc="estimación: Δ0.6 K por Δ0.1 pH" />}
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Electro;