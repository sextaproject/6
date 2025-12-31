import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, InputAdornment, Chip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

const AnionGap = () => {
  const [na, setNa] = useState('');
  const [cl, setCl] = useState('');
  const [hco3, setHco3] = useState('');
  const [gap, setGap] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const sodium = parseFloat(na);
    const chloride = parseFloat(cl);
    const bicarb = parseFloat(hco3);

    if (sodium > 0 && chloride > 0 && bicarb > 0) {
      const value = sodium - (chloride + bicarb);
      setGap(value.toFixed(1));

      if (value < 4) {
        setStatus('Low Anion Gap'); 
      } else if (value <= 12) {
        setStatus('Normal Anion Gap');
      } else {
        setStatus('High Anion Gap (Metabolic Acidosis)');
      }
    } else {
      setGap(null);
      setStatus('');
    }
  }, [na, cl, hco3]);

  const getColor = () => {
    if (status.includes('High')) return 'error';
    if (status.includes('Normal')) return 'success';
    return 'warning';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ScienceIcon color="primary" fontSize="large" />
        <Box>
            <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            ANION GAP
            </Typography>
            <Typography variant="caption">Metabolic Acidosis Evaluation</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <TextField
          label="Sodium (Na+)"
          type="number"
          value={na}
          onChange={(e) => setNa(e.target.value)}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> },
            htmlInput: { min: 0 }
          }}
        />

        <TextField
          label="Chloride (Cl-)"
          type="number"
          value={cl}
          onChange={(e) => setCl(e.target.value)}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> },
            htmlInput: { min: 0 }
          }}
        />

        <TextField
          label="Bicarbonate (HCO3-)"
          type="number"
          value={hco3}
          onChange={(e) => setHco3(e.target.value)}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">mEq/L</InputAdornment> },
            htmlInput: { min: 0 }
          }}
        />

        {gap !== null && (
          <Box sx={{ 
              mt: 1, p: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              textAlign: 'center',
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}>
            <Typography variant="overline" color="text.secondary">CALCULATED GAP</Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {gap}
            </Typography>
            <Typography variant="body2" color="text.secondary">mEq/L</Typography>
            
            <Chip 
                label={status} 
                color={getColor()} 
                sx={{ mt: 2, fontSize: '1rem', py: 2, fontWeight: 'bold' }} 
            />

            {status.includes('High') && (
                <Box sx={{ mt: 2, textAlign: 'left', bgcolor: '#ffebee', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="error">Causes (MUDPILES):</Typography>
                    <Typography variant="caption" color="text.primary">
                        Methanol, Uremia, DKA, Paraldehyde, Iron/INH, Lactic Acidosis, Ethylene Glycol, Salicylates.
                    </Typography>
                </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AnionGap;