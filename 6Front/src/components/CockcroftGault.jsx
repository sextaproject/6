import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, InputAdornment } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale'; 

const RenalCockcroft = () => {
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState(''); 
  const [gender, setGender] = useState('male');
  const [crcl, setCrcl] = useState(null);

  useEffect(() => {
    const cr = parseFloat(creatinine);
    const a = parseFloat(age);
    const w = parseFloat(weight);

    if (cr > 0 && a > 0 && w > 0) {
      let score = ((140 - a) * w) / (72 * cr);

      if (gender === 'female') {
        score *= 0.85;
      }

      setCrcl(score.toFixed(1));
    } else {
      setCrcl(null);
    }
  }, [creatinine, age, weight, gender]);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ScaleIcon color="primary" fontSize="large" />
        <Box>
            <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            COCKCROFT-GAULT
            </Typography>
            <Typography variant="caption">Creatinine Clearance (CrCl)</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
            label="Weight"
            type="number"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            slotProps={{
                input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> },
                htmlInput: { min: 0 }
            }}
            />
            <TextField
            label="Age"
            type="number"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
            />
        </Box>

        <TextField
            label="Creatinine"
            type="number"
            fullWidth
            value={creatinine}
            onChange={(e) => setCreatinine(e.target.value)}
            slotProps={{
                input: { endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> },
                htmlInput: { min: 0, step: 0.1 }
            }}
        />

        <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female (x 0.85)" />
            </RadioGroup>
        </FormControl>

        {crcl && (
          <Box sx={{ 
              mt: 1, p: 3, 
              bgcolor: 'primary.main', 
              color: 'white',
              borderRadius: 2, 
              textAlign: 'center',
              boxShadow: 3
            }}>
            <Typography variant="overline" sx={{ opacity: 0.8 }}>CREATININE CLEARANCE</Typography>
            <Typography variant="h3" fontWeight="bold">
              {crcl}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>mL/min</Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
               Often used for Drug Dosing
            </Typography>
          </Box>
        )}

      </Box>
    </Paper>
  );
};

export default RenalCockcroft;