import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Paper,
  TablePagination,
  Button,
  Chip
} from '@mui/material';
import Client from "../utils/client"
import PatientInfoDialog from "./PatientInfoDialog"
import AddIcon from '@mui/icons-material/Add';
export default function SelectableTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerms, setSearchTerms] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [patients, setPatients] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);

  const handleClickEdit = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };
  const handleClickAdd = () =>{
    setSelectedPatient(null);
    setOpen(true);
  }
  // Fetch patients from API on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let apiUrl = "/patients"
        if(searchTerms.length){
          const searchString = searchTerms.join(',');
          apiUrl = `/patients?search=${searchString}`
        }
        const data = await Client.get(apiUrl);
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };
    fetchPatients();
  }, [searchTerms,refreshTable]);

  // Handle row selection
  const handleSelect = (id) => {
    setSelected([...selected, id]);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleAddSearchTerm = (event) => {
    if (event.key === 'Enter' && searchTerm) {
      setSearchTerms([...searchTerms, searchTerm]);
      setSearchTerm('');
    }
  };
  const handleDeleteSearchTerm = (termToDelete) => {
    setSearchTerms(searchTerms.filter((term) => term !== termToDelete));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p:1 }}>
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <TextField
        variant="outlined"
        placeholder="Search by name, date of birth, address..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleAddSearchTerm} // Add term on Enter key
        sx={{ margin: 1, width: '50%' }}

      />
      <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickAdd}
        >
          Add New Patient
      </Button>
      </Box>
      <Box>
          {searchTerms.map((term, index) => (
            <Chip
              key={index}
              label={term}
              onDelete={() => handleDeleteSearchTerm(term)}
              sx={{ margin: 1}}
            />
          ))}
      </Box>


      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>User Id</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Primary Addresses</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {patients?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const isSelected = selected.indexOf(row.name) !== -1;
              return (
                <TableRow
                  hover
                  onClick={() => handleSelect(row.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isSelected}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.date_of_birth?.split('T')[0]}</TableCell>
                  <TableCell>{row.street}, {row.city}, {row.state},{row.postal_code}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleClickEdit(row)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={patients?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <PatientInfoDialog
        open={open}
        handleClose={handleClose}
        selectedPatient={selectedPatient}
        setRefreshTable={setRefreshTable}
      />
    </Paper>
  );
}
