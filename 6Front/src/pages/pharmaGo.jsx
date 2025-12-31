import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Typography, Paper, InputAdornment, Grid, Card, CardContent, 
  CardActions, Collapse, IconButton, Chip, Container, Switch, FormControlLabel, 
  LinearProgress, Tooltip, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

// --- ESTILOS PERSONALIZADOS ---
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: '0.3s',
  border: '1px solid rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.light,
  },
}));

// Helper shared between cards & dialog
const getSafetyColor = (text) => {
  if (!text) return 'default';
  const t = text.toLowerCase();
  if (t.includes('seguro') || t.includes('compatible') || t.includes('a') || t.includes('aceptado')) return 'success';
  if (t.includes('riesgo') || t.includes('evitar') || t.includes('contraindicado') || t.includes('x')) return 'error';
  return 'warning';
};

const PharmaGo = () => {
  const [searchText, setSearchText] = useState('');
  const [showPediatric, setShowPediatric] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [dialogIsPediatric, setDialogIsPediatric] = useState(false);

  // --- OBTENER DATOS (FETCH) ---
  useEffect(() => {
    const controller = new AbortController();
    const delayDebounceFn = setTimeout(() => {
      const audience = showPediatric ? 'pediatric' : 'adult';
      setLoading(true);

      fetch(
        `http://127.0.0.1:8000/api/pharmago/drugs/?audience=${audience}&search=${encodeURIComponent(searchText)}`,
        { signal: controller.signal }
      )
        .then(response => response.json())
        .then(data => setDrugs(data))
        .catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Error al cargar medicamentos:", e);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(delayDebounceFn);
      setLoading(false);
    };
  }, [searchText, showPediatric]);

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f4f6f8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* 1. ENCABEZADO HERO - FIXED */}
      <Paper elevation={0} sx={{ pt: 3, pb: 4, px: 2, bgcolor: 'primary.main', color: 'white', borderRadius: '0 0 30px 30px', zIndex: 10, flexShrink: 0 }}>
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Button
                  component={Link}
                  to="/menu"
                  startIcon={<ArrowBackIcon />}
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  Volver al menú
                </Button>
            </Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <LocalPharmacyIcon fontSize="large" sx={{ opacity: 0.9 }} />
                    <Typography variant="h4" sx={{ fontFamily: 'Orbitron', fontWeight: 700, letterSpacing: 2 }}>
                        PHARMA GO
                    </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Base de Datos Farmacológica Inteligente
                </Typography>
            </Box>

            {/* BARRA DE BÚSQUEDA */}
            <Paper component="form" sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: 50, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <IconButton sx={{ p: '10px' }}><SearchIcon color="primary" /></IconButton>
                <TextField
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Buscar medicamento, principio activo..."
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                
                {/* INTERRUPTOR PEDIÁTRICO DENTRO DE LA BARRA */}
                <Box sx={{ borderLeft: '1px solid #ddd', pl: 2, ml: 1, display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={showPediatric}
                                onChange={(e) => setShowPediatric(e.target.checked)}
                                color="warning"
                                size="small"
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {showPediatric ? <ChildCareIcon color="warning" /> : <PersonIcon color="action" />}
                                <Typography variant="caption" fontWeight="bold" color={showPediatric ? "warning.main" : "text.secondary"}>
                                    {showPediatric ? "NIÑOS" : "ADULTOS"}
                                </Typography>
                            </Box>
                        }
                    />
                </Box>
            </Paper>
        </Container>
      </Paper>

      {loading && <LinearProgress sx={{ bgcolor: 'transparent' }} />}

      {/* 2. REJILLA DE RESULTADOS - SCROLLABLE */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        pt: 3,
        pb: 8,
        px: 2,
        '&::-webkit-scrollbar': { width: 8 },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 4 },
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
              {drugs.slice(0, 15).map((drug) => (
                  <Grid item xs={12} md={6} lg={4} key={drug.id}>
                      <DrugCard 
                        drug={drug} 
                        isPediatric={showPediatric} 
                        onOpenDetails={(d, isPedsView) => {
                          setSelectedDrug(d);
                          setDialogIsPediatric(isPedsView);
                        }} 
                      />
                  </Grid>
              ))}
              
              {!loading && drugs.length === 0 && (
                  <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
                          <Typography variant="h5">No se encontraron resultados</Typography>
                          <Typography variant="body2">Intenta buscar por nombre genérico o principio activo.</Typography>
                      </Box>
                  </Grid>
              )}
          </Grid>
        </Container>
      </Box>
      <Dialog
        open={Boolean(selectedDrug)}
        onClose={() => setSelectedDrug(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDrug && (
          <Box sx={{ bgcolor: '#f5f7fb' }}>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalPharmacyIcon color="primary" fontSize="large" />
                <Box>
                  {selectedDrug.name}
                  <Typography variant="subtitle2" color="text.secondary">
                    {selectedDrug.category}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ bgcolor: '#f5f7fb' }}>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                {selectedDrug.cat_pregnancy && (
                  <Tooltip title={`Embarazo: ${selectedDrug.cat_pregnancy}`}>
                    <Chip 
                      icon={<PregnantWomanIcon sx={{ fontSize: '1rem !important' }} />} 
                      label={selectedDrug.cat_pregnancy.length > 18 ? `${selectedDrug.cat_pregnancy.slice(0, 18)}…` : selectedDrug.cat_pregnancy} 
                      size="small" 
                      color={getSafetyColor(selectedDrug.cat_pregnancy)} 
                      variant="filled"
                    />
                  </Tooltip>
                )}
                {selectedDrug.cat_liver && !selectedDrug.cat_liver.toLowerCase().includes('no requiere') && (
                  <Tooltip title={`Hígado: ${selectedDrug.cat_liver}`}>
                    <Chip label="Hígado" size="small" color="warning" variant="outlined" />
                  </Tooltip>
                )}
                {selectedDrug.cat_kidney && !selectedDrug.cat_kidney.toLowerCase().includes('no requiere') && (
                  <Tooltip title={`Riñón: ${selectedDrug.cat_kidney}`}>
                    <Chip label="Riñón" size="small" color="error" variant="outlined" />
                  </Tooltip>
                )}
              </Box>

              {dialogIsPediatric ? (
                <Box sx={{ 
                  bgcolor: '#fff3e0', 
                  p: 2,
                  borderRadius: 2,
                  borderLeft: '5px solid #ff9800',
                  boxShadow: '0 6px 20px rgba(255,152,0,0.2)',
                  mb: 2
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#e65100', mb: 0.5 }}>
                    DOSIS PEDIÁTRICA
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedDrug.pediatric_dose || 'Sin datos pediátricos registrados'}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  bgcolor: '#e3f2fd', 
                  p: 2,
                  borderRadius: 2,
                  borderLeft: '5px solid #2196f3',
                  boxShadow: '0 6px 20px rgba(33,150,243,0.15)',
                  mb: 2
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0d47a1', mb: 0.5 }}>
                    DOSIS ADULTO
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedDrug.adult_dose || 'Consultar literatura'}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Vía</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(selectedDrug.presentation || '').split(', ').map((route, i) => (
                      <Chip key={i} label={route} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Frecuencia</Typography>
                  <Typography variant="body2" fontWeight="bold">{selectedDrug.frequency || "-"}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Precauciones & Advertencias
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {selectedDrug.warnings || 'Sin advertencias registradas.'}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#f5f7fb' }}>
              <Button onClick={() => setSelectedDrug(null)}>Cerrar</Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

// --- SUB-COMPONENTE: LÓGICA DE LA TARJETA ---
const DrugCard = ({ drug, isPediatric, onOpenDetails }) => {
  const [expanded, setExpanded] = useState(false);

  // Ayuda para determinar el color de seguridad
  const getSafetyColor = (text) => {
    if (!text) return 'default';
    const t = text.toLowerCase();
    if (t.includes('seguro') || t.includes('compatible') || t.includes('a') || t.includes('aceptado')) return 'success';
    if (t.includes('riesgo') || t.includes('evitar') || t.includes('contraindicado') || t.includes('x')) return 'error';
    return 'warning';
  };

  // Lógica para mostrar la dosis
  const displayDose = isPediatric ? drug.pediatric_dose : drug.adult_dose;
  const hasPediatricData = drug.is_pediatric;

  return (
    <StyledCard onClick={() => onOpenDetails(drug, isPediatric)} sx={{ cursor: 'pointer' }}>
      <CardContent sx={{ flexGrow: 1, position: 'relative', pb: 1 }}>
        
        {/* INSIGNIAS SUPERIORES: Seguridad */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {/* Embarazo */}
            {drug.cat_pregnancy && (
                <Tooltip title={`Embarazo: ${drug.cat_pregnancy}`}>
                    <Chip 
                        icon={<PregnantWomanIcon sx={{ fontSize: '1rem !important' }} />} 
                        label={drug.cat_pregnancy.length > 15 ? drug.cat_pregnancy.substring(0, 15) + '...' : drug.cat_pregnancy} 
                        size="small" 
                        color={getSafetyColor(drug.cat_pregnancy)} 
                        variant="filled"
                    />
                </Tooltip>
            )}
            {/* Hígado (Mini) */}
            {drug.cat_liver && !drug.cat_liver.toLowerCase().includes('no requiere') && (
                <Tooltip title={`Hígado: ${drug.cat_liver}`}>
                    <Chip label="Hígado" size="small" color="warning" variant="outlined" />
                </Tooltip>
            )}
            {/* Riñón (Mini) */}
             {drug.cat_kidney && !drug.cat_kidney.toLowerCase().includes('no requiere') && (
                <Tooltip title={`Riñón: ${drug.cat_kidney}`}>
                    <Chip label="Riñón" size="small" color="error" variant="outlined" />
                </Tooltip>
            )}
        </Box>

        {/* ENCABEZADO: Nombre y Categoría */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 800, color: '#2c3e50', lineHeight: 1.2 }}>
            {drug.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, mb: 2 }}>
            <ScienceIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {drug.category}
            </Typography>
        </Box>

        <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

        {/* CUERPO PRINCIPAL: Dosis */}
        <Box sx={{ 
            bgcolor: isPediatric ? '#fff3e0' : '#e3f2fd', 
            p: 1.5, borderRadius: 2, 
            borderLeft: `4px solid ${isPediatric ? '#ff9800' : '#2196f3'}` 
        }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: isPediatric ? '#e65100' : '#0d47a1', display: 'block', mb: 0.5 }}>
                {isPediatric ? "DOSIS PEDIÁTRICA" : "DOSIS ADULTO"}
            </Typography>
            
            {isPediatric && !hasPediatricData ? (
                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                    No hay datos pediátricos disponibles.
                </Typography>
            ) : (
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-line' }}>
                    {displayDose || "Consultar literatura"}
                </Typography>
            )}
        </Box>

        {/* VÍA Y FRECUENCIA */}
        <Grid container spacing={1} sx={{ mt: 2 }}>
            <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">Vía</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(drug.presentation || '').split(', ').map((route, i) => (
                        <Chip key={i} label={route} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    ))}
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">Frecuencia</Typography>
                <Typography variant="body2" fontWeight="bold">{drug.frequency || "-"}</Typography>
            </Grid>
        </Grid>

      </CardContent>

      {/* PIE DE TARJETA: Acciones */}
      <CardActions disableSpacing sx={{ pt: 0 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary">Ver Advertencias</Typography>
        <ExpandMore
          expand={expanded}
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          aria-expanded={expanded}
          aria-label="ver más"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      {/* PLEGABLE: Advertencias y Efectos */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ bgcolor: '#fafafa', borderTop: '1px solid #eee' }}>
            
            {/* Lógica: Resaltar palabras peligrosas */}
            {(drug.warnings || '').toLowerCase().includes('hipersensibilidad') && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'error.main' }}>
                    <WarningAmberIcon fontSize="small" />
                    <Typography variant="caption" fontWeight="bold">RIESGO ALÉRGICO</Typography>
                </Box>
            )}

            <Typography variant="caption" fontWeight="bold" display="block">Efectos Adversos / Contraindicaciones:</Typography>
            <Typography paragraph variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.5, whiteSpace: 'pre-line' }}>
                {drug.warnings || "Sin advertencias específicas registradas."}
            </Typography>

            <Typography variant="caption" fontWeight="bold" display="block" sx={{ mt: 1 }}>Dosis Máxima:</Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {drug.max_dose || "No especificada"}
            </Typography>
        </CardContent>
      </Collapse>
    </StyledCard>
  );
};

export default PharmaGo;
