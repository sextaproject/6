import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, InputAdornment } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity'; 

const Osmolarity = () => {
  const [na, setNa] = useState('');
  const [glucose, setGlucose] = useState('');
  const [bun, setBun] = useState('');
  const [osmo, setOsmo] = useState(null);

  useEffect(() => {
    const n = parseFloat(na);
    const g = parseFloat(glucose);
    const b = parseFloat(bun);

    if (n > 0 && g > 0 && b > 0) {
      const val = (2 * n) + (g / 18) + (b / 2.8);
      setOsmo(val.toFixed(1));
    } else {
      setOsmo(null);
    }
  }, [na, glucose, bun]);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 450, mx: 'auto', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <OpacityIcon color="primary" fontSize="large" />
        <Box>
            <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            OSMOLARIDAD
            </Typography>
            <Typography variant="caption">Osmolaridad Sérica</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <TextField
          label="Sodio (Na)"
          type="number"
          value={na}
          onChange={(e) => setNa(e.target.value)}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> },
            htmlInput: { min: 0 }
          }}
        />

        <TextField
          label="Glucosa"
          type="number"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> },
            htmlInput: { min: 0 }
          }}
        />

        <TextField
          label="BUN (Nitrogeno Ureico)"
          type="number"
          value={bun}
          onChange={(e) => setBun(e.target.value)}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> },
            htmlInput: { min: 0 }
          }}
        />

        {osmo && (
          <Box sx={{ 
              mt: 2, p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 2, 
              textAlign: 'center',
              border: '1px solid', borderColor: 'divider'
            }}>
            <Typography variant="overline" color="text.secondary">OSMOLARIDAD CALCULADA</Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {osmo}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">mOsm/kg H2O</Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
               Rango Normal: 275 - 295 mOsm/kg
            </Typography>
          </Box>
        )}

      </Box>
    </Paper>
  );
};

export default Osmolarity;