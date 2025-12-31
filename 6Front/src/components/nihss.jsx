import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Chip } from '@mui/material';


const NIHSS = () => {
    const nihssItems = [
    {
    id: '1a', title: '1a. Nivel de Conciencia',
    options: [
      { label: 'Alerta', value: 0 },{ label: 'Somnoliento (no obedece órdenes)', value: 1 },
      { label: 'Estuporoso (obedece solo a estímulos dolorosos)', value: 2 },{ label: 'Comatoso (sin respuesta)', value: 3 },],},
  {
    id: '1b',title: '1b. Preguntas de NdC (Mes y Edad)',
    options: [
      { label: 'Responde ambas correctamente', value: 0 },{ label: 'Responde una correctamente', value: 1 },
      { label: 'Responde ninguna correctamente', value: 2 },],},
  {
    id: '1c',
    title: '1c. Órdenes de NdC (Abrir/Cerrar Ojos, Apretar Mano)',
    options: [
      { label: 'Realiza ambas tareas', value: 0 },
      { label: 'Realiza una tarea', value: 1 },{ label: 'No realiza ninguna tarea', value: 2 },],},
  {
    id: '2',title: '2. Mejor Mirada',
    options: [
      { label: 'Normal', value: 0 },{ label: 'Paresia parcial de la mirada', value: 1 },
      { label: 'Desviación forzada / Paresia total', value: 2 },],},
  {
    id: '3',title: '3. Campos Visuales',
    options: [
      { label: 'Sin pérdida visual', value: 0 },{ label: 'Hemianopsia parcial', value: 1 },
      { label: 'Hemianopsia completa', value: 2 },{ label: 'Hemianopsia bilateral (ceguera)', value: 3 },],},
  {
    id: '4',
    title: '4. Paresia Facial',
    options: [
      { label: 'Normal', value: 0 },{ label: 'Paresia menor (borramiento surco nasolabial)', value: 1 },
      { label: 'Paresia parcial (inferior)', value: 2 },{ label: 'Paresia completa (superior e inferior)', value: 3 },],},
  {
    id: '5a',title: '5a. Motor Brazo Izquierdo',
    options: [
      { label: 'Sin deriva (mantiene 10s)', value: 0 },{ label: 'Deriva (cae antes de 10s)', value: 1 },
      { label: 'Vence gravedad pero no resistencia', value: 2 },{ label: 'No vence gravedad', value: 3 },
      { label: 'Sin movimiento', value: 4 },],},
  {
    id: '5b',title: '5b. Motor Brazo Derecho',
    options: [
      { label: 'Sin deriva (mantiene 10s)', value: 0 },{ label: 'Deriva (cae antes de 10s)', value: 1 },
      { label: 'Vence gravedad pero no resistencia', value: 2 },{ label: 'No vence gravedad', value: 3 },
      { label: 'Sin movimiento', value: 4 },],},
  {
    id: '6a',title: '6a. Motor Pierna Izquierda',
    options: [
      { label: 'Sin deriva (mantiene 5s)', value: 0 },{ label: 'Deriva (cae antes de 5s)', value: 1 },
      { label: 'Vence gravedad pero no resistencia', value: 2 },{ label: 'No vence gravedad', value: 3 },
      { label: 'Sin movimiento', value: 4 },],},
  {
    id: '6b',
    title: '6b. Motor Pierna Derecha',
    options: [
      { label: 'Sin deriva (mantiene 5s)', value: 0 },{ label: 'Deriva (cae antes de 5s)', value: 1 },
      { label: 'Vence gravedad pero no resistencia', value: 2 },{ label: 'No vence gravedad', value: 3 },
      { label: 'Sin movimiento', value: 4 },],},
  {
    id: '7',
    title: '7. Ataxia de Miembros',
    options: [
      { label: 'Ausente', value: 0 },{ label: 'Presente en 1 extremidad', value: 1 },
      { label: 'Presente en 2 extremidades', value: 2 },],},
  {
    id: '8',title: '8. Sensibilidad',
    options: [
      { label: 'Normal', value: 0 },{ label: 'Pérdida leve a moderada', value: 1 },
      { label: 'Pérdida severa a total', value: 2 },],},
  {
    id: '9',
    title: '9. Mejor Lenguaje (Afasia)',
    options: [  { label: 'Normal, sin afasia', value: 0 },{ label: 'Afasia leve a moderada', value: 1 },
      { label: 'Afasia severa', value: 2 },{ label: 'Mutismo / Afasia global', value: 3 },],},
  {
    id: '10',
    title: '10. Disartria',
    options: [{ label: 'Normal', value: 0 },
      { label: 'Leve a moderada', value: 1 },{ label: 'Severa / Anartria', value: 2 },],},
  {
    id: '11',
    title: '11. Extinción e Inatención (Negligencia)',
    options: [
      { label: 'Normal', value: 0 },{ label: 'Inatención leve (extinción a 1 modalidad)', value: 1 },
      { label: 'Inatención severa (extinción a >1 modalidad)', value: 2 },],},
    ];

    const [scores, setScores] = useState({
    '1a': 0,'1b': 0,'1c': 0,'2': 0,'3': 0,'4': 0,'5a': 0,'5b': 0,
    '6a': 0,'6b': 0,'7': 0,'8': 0,'9': 0,'10': 0,'11': 0});

    const handleChange = (questionId, value) => {
    setScores(prev => ({
      ...prev, 
      [questionId]: parseInt(value)
    }));
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const getSeverity = (score) => {
    if (score === 0) return { text: 'No ACV', color: 'success' };
    if (score <= 4) return { text: 'ACV MENOR', color: 'info' };
    if (score <= 15) return { text: 'ACV MODERADO', color: 'warning' };
    if (score <= 20) return { text: 'ACV SEVERO', color: 'error' };
    return { text: 'ACV SEVERO', color: 'error' };
  };

  const result = getSeverity(totalScore);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" color="primary" sx={{ fontFamily: 'Orbitron' }}>
          NIHSS
        </Typography>
        
        <Chip 
          label={`Score: ${totalScore}`} color={result.color} 
          sx={{ fontSize: '1.2rem', padding: 2, fontWeight: 'bold' }} />
      </Box>

      {nihssItems.map((question) => (
        <Box key={question.id} sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
              {question.label}
            </FormLabel>
            
            <RadioGroup
              value={scores[question.id] !== undefined ? scores[question.id] : ''}
              onChange={(e) => handleChange(question.id, e.target.value)}>
              {question.options.map((option) => (
                <FormControlLabel 
                  key={option.value} 
                  value={option.value} 
                  control={<Radio />} 
                  label={option.label}
                  sx={{ mb: 1 }} />
              ))}
            </RadioGroup>
          </FormControl>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}

      <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h6">RESULTADO</Typography>
        <Typography variant="h4" color={result.color + '.main'} sx={{ fontWeight: 'bold', mt: 1 }}>
          {result.text}
        </Typography>
      </Box>
    </Paper>
  );
};

export default NIHSS;


