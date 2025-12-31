import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, InputAdornment, Chip, Divider } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';

const AaGradient = () => {
  const [paO2, setPaO2] = useState('');      
  const [paCO2, setPaCO2] = useState('');    
  const [fiO2, setFiO2] = useState('21');    
  const [patm, setPatm] = useState('760');   
  const [age, setAge] = useState('');       
  
  const [gradient, setGradient] = useState(null);
  const [expected, setExpected] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const pO2 = parseFloat(paO2);
    const pCO2 = parseFloat(paCO2);
    const fi = parseFloat(fiO2);
    const pressure = parseFloat(patm);
    const patientAge = parseFloat(age);

    if (pO2 > 0 && pCO2 > 0 && fi > 0 && pressure > 0) {
      const waterVapor = 47; 
      const rq = 0.8;        

      const fiDecimal = fi / 100; 
      const AlveolarO2 = (fiDecimal * (pressure - waterVapor)) - (pCO2 / rq);

      const grad = AlveolarO2 - pO2;
      setGradient(grad.toFixed(1));

      if (patientAge > 0) {
        const exp = (patientAge / 4) + 4;
        setExpected(exp.toFixed(1));

        if (grad > exp) {
            setStatus('High Gradient (V/Q Mismatch, Shunt, Diffusion)');
        } else {
            setStatus('Normal Gradient (Hypoventilation, Low FiO2)');
        }
      } else {
        setExpected(null);
        setStatus('');
      }

    } else {
      setGradient(null);
      setExpected(null);
      setStatus('');
    }
  }, [paO2, paCO2, fiO2, patm, age]);

  const getColor = () => {
    if (status.includes('High')) return 'error';
    if (status.includes('Normal')) return 'success';
    return 'default';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 550, mx: 'auto', borderRadius: 3 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AirIcon color="primary" fontSize="large" />
        <Box>
            <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            A-a GRADIENT
            </Typography>
            <Typography variant="caption">Alveolar-arterial Gradient</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                label="PaO2 (Arterial)"
                type="number"
                fullWidth
                value={paO2}
                onChange={(e) => setPaO2(e.target.value)}
                slotProps={{
                    input: { endAdornment: <InputAdornment position="end">mmHg</InputAdornment> },
                    htmlInput: { min: 0 }
                }}
            />
            <TextField
                label="PaCO2 (Arterial)"
                type="number"
                fullWidth
                value={paCO2}
                onChange={(e) => setPaCO2(e.target.value)}
                slotProps={{
                    input: { endAdornment: <InputAdornment position="end">mmHg</InputAdornment> },
                    htmlInput: { min: 0 }
                }}
            />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                label="FiO2 (%)"
                type="number"
                fullWidth
                value={fiO2}
                helperText="Room Air = 21%"
                onChange={(e) => setFiO2(e.target.value)}
                slotProps={{
                    input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
                    htmlInput: { min: 21, max: 100 }
                }}
            />
            <TextField
                label="Patm (Pressure)"
                type="number"
                fullWidth
                value={patm}
                helperText="Sea Level = 760"
                onChange={(e) => setPatm(e.target.value)}
                slotProps={{
                    input: { endAdornment: <InputAdornment position="end">mmHg</InputAdornment> },
                    htmlInput: { min: 0 }
                }}
            />
        </Box>

        <TextField
            label="Patient Age"
            type="number"
            value={age}
            helperText="Required for 'Expected' value"
            onChange={(e) => setAge(e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
        />

        <Divider />

        {gradient !== null && (
          <Box sx={{ 
              p: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 2
            }}>
            <Typography variant="overline" color="text.secondary">CALCULATED GRADIENT</Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {gradient}
            </Typography>
            <Typography variant="body2" color="text.secondary">mmHg</Typography>
            
            {expected && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Expected for Age: <strong>{expected} mmHg</strong>
                    </Typography>
                    <Chip 
                        label={status} 
                        color={getColor()} 
                        sx={{ mt: 1, fontSize: '0.9rem', py: 2, fontWeight: 'bold' }} 
                    />
                </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AaGradient;