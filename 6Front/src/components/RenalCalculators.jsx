import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Typography, Paper, RadioGroup, FormControlLabel, 
  Radio, FormControl, FormLabel, InputAdornment, Grid, Divider, Chip 
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScienceIcon from '@mui/icons-material/Science';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ScaleIcon from '@mui/icons-material/Scale';

const RenalCalculators = () => {
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [race, setRace] = useState('other');

  const [ckdEpiGfr, setCkdEpiGfr] = useState(null);
  const [ckdEpiStage, setCkdEpiStage] = useState('');
  const [mdrdGfr, setMdrdGfr] = useState(null);
  const [mdrdStage, setMdrdStage] = useState('');
  const [crCl, setCrCl] = useState(null);

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

      setCkdEpiGfr(score.toFixed(1));

      if (score >= 90) setCkdEpiStage('G1: Normal');
      else if (score >= 60) setCkdEpiStage('G2: Leve');
      else if (score >= 45) setCkdEpiStage('G3a: Leve-Moderado');
      else if (score >= 30) setCkdEpiStage('G3b: Moderado-Severo');
      else if (score >= 15) setCkdEpiStage('G4: Severamente Disminuido');
      else setCkdEpiStage('G5: Falla Renal');
    } else {
      setCkdEpiGfr(null);
      setCkdEpiStage('');
    }
  }, [creatinine, age, gender]);

  useEffect(() => {
    const creat = parseFloat(creatinine);
    const ageNum = parseFloat(age);

    if (creat > 0 && ageNum > 0) {
      let score = 175 * Math.pow(creat, -1.154) * Math.pow(ageNum, -0.203);

      if (gender === 'female') score *= 0.742;
      if (race === 'black') score *= 1.212;

      setMdrdGfr(score.toFixed(1));

      if (score >= 90) setMdrdStage('Estadio 1 (Normal)');
      else if (score >= 60) setMdrdStage('Estadio 2 (Leve)');
      else if (score >= 30) setMdrdStage('Estadio 3 (Moderado)');
      else if (score >= 15) setMdrdStage('Estadio 4 (Severo)');
      else setMdrdStage('Estadio 5 (Falla Renal)');
    } else {
      setMdrdGfr(null);
      setMdrdStage('');
    }
  }, [creatinine, age, gender, race]);

  useEffect(() => {
    const cr = parseFloat(creatinine);
    const a = parseFloat(age);
    const w = parseFloat(weight);

    if (cr > 0 && a > 0 && w > 0) {
      let score = ((140 - a) * w) / (72 * cr);
      if (gender === 'female') score *= 0.85;
      setCrCl(score.toFixed(1));
    } else {
      setCrCl(null);
    }
  }, [creatinine, age, weight, gender]);

  const getStageColor = (gfr) => {
    const value = parseFloat(gfr);
    if (value >= 90) return '#4caf50';
    if (value >= 60) return '#8bc34a';
    if (value >= 45) return '#ffed49';
    if (value >= 30) return '#ff9800';
    if (value >= 15) return '#f44336';
    return '#b71c1c';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CompareArrowsIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
            Calculadoras Renales
          </Typography>
          <Typography variant="caption" color="text.secondary">
            CKD-EPI 2021 vs MDRD
          </Typography>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
          DATOS DEL PACIENTE
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={4} md={2.4}>
            <TextField
              label="Creatinina"
              type="number"
              fullWidth
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> },
                htmlInput: { min: 0, step: 0.1 }
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <TextField
              label="Edad"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">años</InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <TextField
              label="Peso"
              type="number"
              fullWidth
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={2.4}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.75rem' }}>Sexo</FormLabel>
              <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                <FormControlLabel value="male" control={<Radio size="small" />} label="M" />
                <FormControlLabel value="female" control={<Radio size="small" />} label="F" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.75rem' }}>Raza (MDRD)</FormLabel>
              <RadioGroup row value={race} onChange={(e) => setRace(e.target.value)}>
                <FormControlLabel value="other" control={<Radio size="small" />} label="Otro" />
                <FormControlLabel value="black" control={<Radio size="small" />} label="Negro" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              border: '2px solid',
              borderColor: ckdEpiGfr ? getStageColor(ckdEpiGfr) : 'grey.300',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ScienceIcon color="primary" />
              <Typography variant="h6" sx={{ fontFamily: 'Orbitron', fontSize: '1rem' }}>
                CKD-EPI 2021
              </Typography>
              <Chip label="Recomendado" size="small" color="success" sx={{ ml: 'auto' }} />
            </Box>
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Filtrado Glomerular
            </Typography>

            {ckdEpiGfr ? (
              <Box sx={{ 
                mt: 2, p: 2, 
                bgcolor: getStageColor(ckdEpiGfr), 
                color: parseFloat(ckdEpiGfr) >= 45 && parseFloat(ckdEpiGfr) < 60 ? 'black' : 'white',
                borderRadius: 2, 
                textAlign: 'center'
              }}>
                <Typography variant="overline" sx={{ opacity: 0.9 }}>TFGe</Typography>
                <Typography variant="h3" fontWeight="bold">{ckdEpiGfr}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>mL/min/1.73m²</Typography>
                <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="subtitle2" fontWeight="bold">{ckdEpiStage}</Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 2, p: 3, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                <Typography color="text.disabled">Ingrese datos del paciente</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              border: '2px solid',
              borderColor: mdrdGfr ? getStageColor(mdrdGfr) : 'grey.300',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WaterDropIcon color="secondary" />
              <Typography variant="h6" sx={{ fontFamily: 'Orbitron', fontSize: '1rem' }}>
                MDRD
              </Typography>
              <Chip label="Clásico" size="small" variant="outlined" sx={{ ml: 'auto' }} />
            </Box>
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ecuación MDRD de 4 variables — Incluye factor de raza
            </Typography>

            {mdrdGfr ? (
              <Box sx={{ 
                mt: 2, p: 2, 
                bgcolor: getStageColor(mdrdGfr), 
                color: parseFloat(mdrdGfr) >= 45 && parseFloat(mdrdGfr) < 60 ? 'black' : 'white',
                borderRadius: 2, 
                textAlign: 'center'
              }}>
                <Typography variant="overline" sx={{ opacity: 0.9 }}>TFG Estimada</Typography>
                <Typography variant="h3" fontWeight="bold">{mdrdGfr}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>mL/min/1.73m²</Typography>
                <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="subtitle2" fontWeight="bold">{mdrdStage}</Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 2, p: 3, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                <Typography color="text.disabled">Ingrese datos del paciente</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              border: '2px solid',
              borderColor: crCl ? '#7c4dff' : 'grey.300',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ScaleIcon sx={{ color: '#7c4dff' }} />
              <Typography variant="h6" sx={{ fontFamily: 'Orbitron', fontSize: '1rem' }}>
                COCKCROFT-GAULT
              </Typography>
              <Chip label="Dosificación" size="small" color="secondary" sx={{ ml: 'auto' }} />
            </Box>
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Aclaramiento de Creatinina — Requiere peso del paciente — Usado para ajuste de dosis de medicamentos
            </Typography>

            {crCl ? (
              <Box sx={{ 
                mt: 2, p: 2, 
                bgcolor: '#7c4dff', 
                color: 'white',
                borderRadius: 2, 
                textAlign: 'center'
              }}>
                <Typography variant="overline" sx={{ opacity: 0.9 }}>ACLARAMIENTO DE CREATININA</Typography>
                <Typography variant="h3" fontWeight="bold">{crCl}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>mL/min</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic', opacity: 0.8 }}>
                  Fórmula preferida para ajuste de dosis farmacológicas
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 2, p: 3, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                <Typography color="text.disabled">
                  {weight ? 'Ingrese creatinina y edad' : 'Requiere peso del paciente'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {(ckdEpiGfr || mdrdGfr || crCl) && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderColor: 'info.light', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="info.dark" sx={{ mb: 1 }}>
            📋 Notas de Interpretación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>CKD-EPI 2021</strong> es la ecuación recomendada actualmente para estadificar ERC.<br/>
            • <strong>MDRD</strong> puede subestimar la TFG en pacientes con función renal normal o cercana a lo normal.<br/>
            • <strong>Cockcroft-Gault</strong> es la fórmula preferida para ajuste de dosis de medicamentos (requiere peso).<br/>
            • Todas las ecuaciones son menos precisas en: embarazo, masa muscular extrema, amputados, desnutrición severa.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default RenalCalculators;

