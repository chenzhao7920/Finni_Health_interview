import React , { useEffect, useState } from 'react';
import { Box,Grid,Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, InputAdornment, IconButton, Divider  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Client from "../utils/client"
const PatientInfoDialog = ({ open, handleClose, selectedPatient,setRefreshTable }) => {
  const [patient, setPatient] = useState(selectedPatient);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [primaryAddress, setPrimaryAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',

  });
  const [customFields, setCustomFields] = useState([{ key: '', value: '' }]);
  const handleCustomFieldChange = (index, event) => {
    const updatedFields = [...customFields];
    updatedFields[index][event.target.name] = event.target.value;
    setCustomFields(updatedFields);
  };
  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };
  const removeCustomField = (index) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields([...updatedFields]);
  };
  // Fetch patients from API on component mount
  useEffect(() => {
      const fetchPatients = async () => {
        let data;
        try {
          if(selectedPatient?.id){
            let apiUrl = `/patients/${selectedPatient?.id}`
            data = await Client.get(apiUrl)
          }
          data?.patient_addresses?.forEach(address => {
            if(address.is_primary_address) {
              setPrimaryAddress({
                street: address?.street,
                city: address?.city,
                state: address?.state,
                postal_code: address?.postal_code,
              });
            }else {
              setNewAddress({
                street: address?.street,
                city: address?.city,
                state: address?.state,
                postal_code: address?.postal_code,
              });
            }
          })
          setPatient({
            first_name: selectedPatient.first_name || '',
            last_name: selectedPatient.last_name || '',
            Status: selectedPatient.status || '',
            date_of_birth: selectedPatient.date_of_birth || '',
            custom_fields: selectedPatient.custom_fields || {}
          })
          if(data?.custom_fields){
            const updatedCustomFields = Object.entries(data?.custom_fields).map(([key,value])=>({key, value}))
            setCustomFields(updatedCustomFields)
          }
        } catch (error) {
          console.error('Failed to fetch patients:', error);
        }
      };

      fetchPatients();
   }, [selectedPatient,])
  const toggleAddAddress = () => {
    setIsAddingAddress((prev) => !prev);
    if (isAddingAddress) {
      setNewAddress({ street: '', city: '', state: '', postal_code: '' });
    }
  };
  const toggleEditAddress = () => {
    setIsEditingAddress((prev) => !prev);
    // Reset secondAddress fields when toggling
    if (isEditingAddress) {
      setNewAddress({ street: '', city: '', state: '', postal_code: '' });
    }
  };
  const handlePrimaryAddressChange = (e) => {
    setPrimaryAddress({ ...primaryAddress, [e.target.name]: e.target.value });
  };
  const handleSecondAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient((prevPatient) => ({...prevPatient,[name]: value }))
  };

  const handleSave = async() => {
    const customFieldsJson = customFields.reduce((obj, field) => {
      if (field.key) {
        obj[field.key] = field.value;
      }
      return obj;
    }, {});
    // Perform save logic here, like sending an API request to update Patient and patient address
    try {
      let apiUrl = `/patients/${selectedPatient.patient_id}`
      await Client.put(apiUrl, {
        ...patient,
        custom_fields: customFieldsJson,
        primary_address: primaryAddress,
        new_address: newAddress
      })

      setRefreshTable(prev => !prev)
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle color="primary">
        {
          selectedPatient ?  `Edit Patient Info` : `New Patient Info`
        }
      </DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          name="first_name"
          value={patient?.first_name || selectedPatient?.first_name || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Last Name"
          name="last_name"
          value={patient?.last_name || selectedPatient?.last_name || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Status"
          name="status"
          value={patient?.status || selectedPatient?.status || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={patient?.date_of_birth?.split('T')[0] || selectedPatient?.date_of_birth?.split('T')[0] || ''}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{
            shrink: true, // Ensures the label shrinks above the input
          }}
        />
        <TextField
          disabled
          label="Primary Address"
          name="primaryAddress"
          value= { selectedPatient ? `${selectedPatient?.street || ''}, ${selectedPatient?.city || ''}, ${selectedPatient?.state || ''}, ${selectedPatient?.postal_code || ''}` : null}
          fullWidth
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleEditAddress} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={toggleAddAddress} color="primary">
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isEditingAddress && (
          <Box sx={{ display: 'flex', gap: 2}}>
              <TextField
                label="Street"
                name="street"
                id="standard-required"
                variant="standard"
                value={primaryAddress?.street || selectedPatient?.street}
                onChange={handlePrimaryAddressChange}
                margin="dense"
              />
              <TextField
                label="City"
                name="city"
                id="standard-required"
                variant="standard"
                value={primaryAddress?.city || selectedPatient?.city}
                onChange={handlePrimaryAddressChange}
                margin="dense"
              />
              <TextField
                label="State"
                name="state"
                id="standard-required"
                variant="standard"
                value={primaryAddress?.state || selectedPatient?.state}
                onChange={handlePrimaryAddressChange}
                margin="dense"
              />
              <TextField
                label="Postal Code"
                name="postal_code"
                id="standard-required"
                variant="standard"
                value={primaryAddress?.postal_code || selectedPatient?.postal_code}
                onChange={handlePrimaryAddressChange}
                margin="dense"
              />
            </Box>
        )}

        {isAddingAddress && (
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Enter details for the second address:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2}}>
              <TextField
                label="Street"
                name="street"
                id="standard-required"
                variant="standard"
                value={newAddress?.street || ''}
                onChange={handleSecondAddressChange}
                margin="dense"

              />
              <TextField
                label="City"
                name="city"
                id="standard-required"
                variant="standard"
                value={newAddress?.city || ''}
                onChange={handleSecondAddressChange}
                margin="dense"

              />
              <TextField
                label="State"
                name="state"
                id="standard-required"
                variant="standard"
                value={newAddress?.state || ''}
                onChange={handleSecondAddressChange}
                margin="dense"

              />
              <TextField
                label="Postal Code"
                name="postal_code"
                id="standard-required"
                variant="standard"
                value={newAddress?.postal_code || ''}
                onChange={handleSecondAddressChange}
                margin="dense"

              />
            </Box>
          </Box>
        )}
        <Box sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">Custom Fields</Typography>
        {customFields?.map((field, index) =>  (
          <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 1 }}>
            <Grid item xs={5}>
              <TextField
                label="Field name"
                variant="outlined"
                name="key"
                value={field.key}
                onChange={(event) => handleCustomFieldChange(index, event)}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks above the input
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Field value"
                variant="outlined"
                name="value"
                value={field.value}
                onChange={(event) => handleCustomFieldChange(index, event)}
                fullWidth
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks above the input
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => removeCustomField(index)} color="secondary">
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
         ))}
        <Button
          variant="outlined"
          onClick={addCustomField}
          startIcon={<AddIcon />}
        >
          Add Field
        </Button>
       </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientInfoDialog;
