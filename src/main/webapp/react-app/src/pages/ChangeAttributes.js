import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { userService } from '../services/api'; 
import { useSnackbar } from 'notistack';

const ChangeAttributes = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      nome: '',
      apelido: '',
      telefone: '',
      morada: '',
      codigoPostal: '',
      localidade: '',
      nif: '',
    },
    professionalInfo: {
      organizacao: '',
      departamento: '',
      cargo: '',
    },
    identificationInfo: {
      tipoDocumento: '',
      numeroDocumento: '',
      dataEmissao: '',
      dataValidade: '',
      entidadeEmissora: '',
    }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Since there's no getUser endpoint, we need to list all users and find the one we need
        const response = await userService.listUsers();
        const user = response.data.find(u => u.username === userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        setUserData(user);
        
        // Set form data from user data
        setFormData({
          personalInfo: {
            nome: user.fullName?.split(' ')[0] || '',
            apelido: user.fullName?.split(' ').slice(1).join(' ') || '',
            telefone: user.phone || '',
            morada: user.address || '',
            codigoPostal: user.postalCode || '',
            localidade: user.residence || '',
            nif: user.taxId || '',
          },
          professionalInfo: {
            organizacao: user.employer || '',
            departamento: '',
            cargo: user.jobTitle || '',
          },
          identificationInfo: {
            tipoDocumento: 'CC',
            numeroDocumento: user.citizenCard || '',
            dataEmissao: '',
            dataValidade: '',
            entidadeEmissora: '',
          }
        });
      } catch (err) {
        setError('Falha ao carregar dados do utilizador.');
        enqueueSnackbar('Falha ao carregar dados do utilizador.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, enqueueSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare attributes object
      const atributos = {
        ...formData.personalInfo,
        ...formData.professionalInfo,
        ...formData.identificationInfo,
      };

      await userService.changeAttributes({
        identificador: userId,
        atributos: atributos
      });
      
      enqueueSnackbar('Atributos atualizados com sucesso!', { variant: 'success' });
      navigate('/dashboard/list-users');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar atributos';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Alert severity="error">Utilizador não encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            padding: 4, 
            width: '100%', 
            border: '1px solid #e0e0e0',
            boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.07)',
            borderRadius: (theme) => theme.shape.borderRadius,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Alterar Atributos do Utilizador
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 3 }}>
            {userData.username} ({userData.email})
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Personal Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Informações Pessoais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="personalInfo.nome"
                  value={formData.personalInfo.nome}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apelido"
                  name="personalInfo.apelido"
                  value={formData.personalInfo.apelido}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="personalInfo.telefone"
                  value={formData.personalInfo.telefone}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NIF"
                  name="personalInfo.nif"
                  value={formData.personalInfo.nif}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Morada"
                  name="personalInfo.morada"
                  value={formData.personalInfo.morada}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  name="personalInfo.codigoPostal"
                  value={formData.personalInfo.codigoPostal}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Localidade"
                  name="personalInfo.localidade"
                  value={formData.personalInfo.localidade}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            {/* Professional Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Informações Profissionais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organização"
                  name="professionalInfo.organizacao"
                  value={formData.professionalInfo.organizacao}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departamento"
                  name="professionalInfo.departamento"
                  value={formData.professionalInfo.departamento}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  name="professionalInfo.cargo"
                  value={formData.professionalInfo.cargo}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            {/* Identification Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Informações de Identificação
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tipo de Documento"
                  name="identificationInfo.tipoDocumento"
                  value={formData.identificationInfo.tipoDocumento}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número do Documento"
                  name="identificationInfo.numeroDocumento"
                  value={formData.identificationInfo.numeroDocumento}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Data de Emissão"
                  name="identificationInfo.dataEmissao"
                  type="date"
                  value={formData.identificationInfo.dataEmissao}
                  onChange={handleChange}
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Data de Validade"
                  name="identificationInfo.dataValidade"
                  type="date"
                  value={formData.identificationInfo.dataValidade}
                  onChange={handleChange}
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Entidade Emissora"
                  name="identificationInfo.entidadeEmissora"
                  value={formData.identificationInfo.entidadeEmissora}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Atualizar'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/dashboard/list-users')}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangeAttributes;
