import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, InputAdornment } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const RenalMDRD = () => {
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male'); 
  const [race, setRace] = useState('other');    
  const [gfr, setGfr] = useState(null);
  const [stage, setStage] = useState('');

  useEffect(() => {
    const creat = parseFloat(creatinine);
    const ageNum = parseFloat(age);

    if (creat > 0 && ageNum > 0) {
      let score = 175 * Math.pow(creat, -1.154) * Math.pow(ageNum, -0.203);

      if (gender === 'female') score *= 0.742;
      if (race === 'black') score *= 1.212;

      const finalGfr = score.toFixed(1);
      setGfr(finalGfr);

      if (score >= 90) setStage('Stage 1 (Normal)');
      else if (score >= 60) setStage('Stage 2 (Mild)');
      else if (score >= 30) setStage('Stage 3 (Moderate)');
      else if (score >= 15) setStage('Stage 4 (Severe)');
      else setStage('Stage 5 (Kidney Failure)');

    } else {
      setGfr(null);
      setStage('');
    }
  }, [creatinine, age, gender, race]);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <WaterDropIcon color="primary" fontSize="large" />
        <Box>
            <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            MDRD GFR
            </Typography>
            <Typography variant="caption">Renal Function Calculator</Typography>
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
            <FormLabel id="gender-label">Gender</FormLabel>
            <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
        </FormControl>

        <FormControl>
            <FormLabel id="race-label">Race</FormLabel>
            <RadioGroup row value={race} onChange={(e) => setRace(e.target.value)}>
                <FormControlLabel value="other" control={<Radio />} label="Non-Black" />
                <FormControlLabel value="black" control={<Radio />} label="Black" />
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
            <Typography variant="overline" sx={{ opacity: 0.8 }}>ESTIMATED GFR</Typography>
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

export default RenalMDRD;