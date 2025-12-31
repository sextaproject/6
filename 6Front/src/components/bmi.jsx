import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, InputAdornment } from '@mui/material';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HeightIcon from '@mui/icons-material/Height';

const BMI = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState('');

  const bmiCategories = [
    { max: 18.5, label: 'Peso Bajo' },
    { max: 24.9, label: 'Normal' },
    { max: 29.9, label: 'Sobrepeso' },
    { max: 34.9, label: 'Obesidad Moderada' },
    { max: Infinity, label: 'Obesity Morbida' }
  ];

  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const calculatedBmi = (w / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(calculatedBmi);
      const foundCategory = bmiCategories.find(cat => calculatedBmi < cat.max);
      setStatus(foundCategory ? foundCategory.label : 'Obesidad Mórbida');
    } else {
      setBmi(null); 
      setStatus('');
    }
  }, [weight, height]);

return (
  <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
    <Typography variant="h6" color="primary" gutterBottom sx={{ fontFamily: 'Orbitron', mb: 2 }}>
        IMC </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <TextField
          label="Peso"
          type="number"
          variant="outlined"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <MonitorWeightIcon color="primary" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          },
          htmlInput: { 
            min: 0, 
            step: "0.1"
          }
        }}
      />

      <TextField
        label="Altura"
        type="number"
        variant="outlined"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <HeightIcon color="primary" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          },
          htmlInput: { 
            min: 0 
          }
        }}
      />

        {bmi && (
          <Box 
            sx={{ 
              mt: 2, p: 2, 
              bgcolor: 'primary.main', 
              color: 'white', 
              borderRadius: 2, 
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(30, 136, 229, 0.2)'
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.8 }}>
              RESULTADO
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {bmi}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {status}
            </Typography>
          </Box>
        )}

      </Box>
    </Paper>
  );
};

export default BMI;