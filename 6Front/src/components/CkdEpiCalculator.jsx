import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, InputAdornment } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

const RenalCKDEPI = () => {
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [gfr, setGfr] = useState(null);
  const [stage, setStage] = useState('');

  useEffect(() => {
    const scr = parseFloat(creatinine); 
    const ag = parseFloat(age);

    if (scr > 0 && ag > 0) {
      const kappa = gender === 'female' ? 0.7 : 0.9;
      const alpha = gender === 'female' ? -0.241 : -0.302;
      const genderFactor = gender === 'female' ? 1.012 : 1;

      const factor1 = Math.min(scr / kappa, 1);
      const factor2 = Math.max(scr / kappa, 1);
      
      const score = 142 * Math.pow(factor1, alpha) * Math.pow(factor2, -1.200) * Math.pow(0.9938, ag) * genderFactor;

      setGfr(score.toFixed(1));

      if (score >= 90) setStage('G1: Normal');
      else if (score >= 60) setStage('G2: Mildly Decreased');
      else if (score >= 45) setStage('G3a: Mild-Moderate');
      else if (score >= 30) setStage('G3b: Moderate-Severe');
      else if (score >= 15) setStage('G4: Severely Decreased');
      else setStage('G5: Kidney Failure');
      
    } else {
      setGfr(null);
      setStage('');
    }
  }, [creatinine, age, gender]);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <ScienceIcon color="primary" fontSize="large" />
        <Box>
            <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            CKD-EPI (2021)
            </Typography>
            <Typography variant="caption">Modern eGFR Standard</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            <TextField
                label="Age"
                type="number"
                fullWidth
                value={age}
                onChange={(e) => setAge(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
            />
        </Box>

        <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
        </FormControl>

        {gfr && (
          <Box sx={{ 
              mt: 1, p: 3, 
              bgcolor: 'primary.main', 
              color: 'white',
              borderRadius: 2, 
              textAlign: 'center',
              boxShadow: 3
            }}>
            <Typography variant="overline" sx={{ opacity: 0.8 }}>eGFR</Typography>
            <Typography variant="h3" fontWeight="bold">
              {gfr}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>mL/min/1.73m²</Typography>
            
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                <Typography variant="h6" fontWeight="bold">
                    {stage}
                </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RenalCKDEPI;