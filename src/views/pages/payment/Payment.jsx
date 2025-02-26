import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import apiurl from 'constant/apiurl';
import { apiGet, apiPost } from 'services/useAuth';
import { Badge, Box } from '@mui/material';

const Payments = () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState(false);
  const [paymentsData, setPaymentsData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const getAllSteps = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}payments/?sort=id:desc`;
        const params = {
          page: page + 1,
          limit: pageSize
        };
        const response = await apiGet(URL, params, token);
        console.log(response);
        setPaymentsData(response.data.payload.records);
        setTotalCount(response.data.payload.totalRecords);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllSteps();
  }, [page, pageSize]);

  return (
    <>
      <Box sx={{ backgroundColor: 'white', py: 2, px: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h3">All Payments</Typography>
        <Typography variant="subtitle1" component="p"></Typography>
      </Box>
      <Typography align="right" sx={{ mb: '15px' }}></Typography>
      <TableContainer component={Paper}>
        {isLoading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Payment ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Plan</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              paymentsData.length > 0 ? (
                paymentsData.map((data) => (
                  <TableRow key={data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row">
                      {data.id}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      {data.users?.name}
                    </TableCell>
                    <TableCell align="center">{data.users?.email}</TableCell>
                    <TableCell align="center">${data?.amount}</TableCell>
                    <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                      {data?.users?.plan}
                    </TableCell>
                    <TableCell align="center">
                      <Badge badgeContent={data?.status} color="error"></Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default Payments;
