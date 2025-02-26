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
import { MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';

const Steps = () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState();
  const [stepsData, setStepsData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const getAllSteps = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}steps`;
        const params = {
          page: page + 1,
          limit: pageSize
        };
        const response = await apiGet(URL, params, token);
        setStepsData(response.data.payload.records);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    getAllSteps();
  }, []);

  console.log(stepsData);

  return (
    <>
      <Box sx={{ backgroundColor: 'white', py: 2, px: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h3">Steps & Questions</Typography>
      </Box>
      <Typography align="right" sx={{ mb: '15px' }}></Typography>
      <TableContainer component={Paper}>
        {isLoading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Questions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              stepsData.length > 0 ? (
                stepsData.map((data) => (
                  <TableRow key={data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row">
                      {data.name}
                    </TableCell>
                    <TableCell align="center">{data?.title}</TableCell>
                    <TableCell align="center">{data?.description}</TableCell>
                    <TableCell align="center">
                      {data?.questions?.length > 0 ? (
                        <Select
                          value={data.questions[0]}
                          fullWidth
                          size="small"
                          sx={{
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            '& .MuiSelect-select': {
                              padding: '8px'
                            }
                          }}
                        >
                          {data?.questions?.map((item, index) => (
                            <MenuItem key={index} value={item}>
                              {item.title}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No answers available
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
          setGetLoading(true);
        }}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setPage(0);
          setGetLoading(true);
        }}
      />
    </>
  );
};
export default Steps;
