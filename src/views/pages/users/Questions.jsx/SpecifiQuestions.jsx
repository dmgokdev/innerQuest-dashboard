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
import { useParams } from 'react-router-dom';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { ArrowDropDownCircleOutlined, PictureAsPdf } from '@mui/icons-material';

const SpecifiQuestions = () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { id } = useParams();
  console.log(id);
  const getAllQuestions = async () => {
    setIsLoading(true);
    if (userInfo && token) {
      try {
        const URL = `${apiurl.API_URL}users/${id}`;
        const params = {
          page: page + 1,
          limit: pageSize
        };
        const response = await apiGet(URL, params, token);
        setUserDetails(response.data.payload);
        setTotalCount(response.data.payload.totalRecords);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    getAllQuestions();
  }, [page, pageSize]);

  console.log(userDetails);

  return (
    <>
      <Box sx={{ backgroundColor: 'white', py: 2, px: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h3">User Detail</Typography>
      </Box>
      <Typography align="right" sx={{ mb: '15px' }}></Typography>
      <TableContainer component={Paper}>
        {isLoading && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              {/* <TableCell align="center">Answers </TableCell> */}
              <TableCell align="center">Plan </TableCell>
              <TableCell align="center">Business Idea Generation</TableCell>
              <TableCell align="center">Generated PDFs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              userDetails ? (
                <TableRow key={userDetails?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row">
                    {userDetails?.name}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {userDetails?.email}
                  </TableCell>
                  {/* <TableCell align="center">
                  {userDetails?.user_answers?.length > 0 ? (
                    <Select
                      value={userDetails?.user_answers[0]}
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
                      {userDetails?.user_answers?.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item.answer}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No answers available
                    </Typography>
                  )}
                </TableCell> */}
                  <TableCell align="center" component="th" scope="row">
                    {userDetails?.plan}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {userDetails?.user_answers_logs?.length > 0 ? (
                      userDetails.user_answers_logs.map((log, logIndex) =>
                        log?.bussiness_idea?.length > 0 ? (
                          <div key={logIndex} style={{ marginBottom: '8px' }}>
                            {`Submission ${logIndex + 1}`}
                          </div>
                        ) : null
                      )
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', marginBottom: '8px' }}>
                        No Attempts
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      marginLeft: 2
                    }}
                  >
                    {userDetails?.user_answers_logs?.length > 0 ? (
                      userDetails?.user_answers_logs?.map((log, logIndex) =>
                        log?.bussiness_idea?.length > 0 ? (
                          <Select
                            key={logIndex}
                            value=""
                            fullWidth
                            size="small"
                            displayEmpty
                            sx={{
                              backgroundColor: '#f9f9f9',
                              borderRadius: '8px',
                              fontSize: '14px',
                              marginBottom: '8px',
                              maxWidth: '300px',
                              textAlign: 'center'
                            }}
                            onChange={(e) => window.open(e.target.value, '_blank')}
                          >
                            <MenuItem value="" disabled>
                              {`Business Idea Generation ${logIndex + 1} - PDFs`}
                            </MenuItem>
                            {log?.bussiness_idea?.map((pdf, index) =>
                              pdf?.pdf_path ? (
                                <MenuItem key={`${logIndex}-${index}`} value={`${apiurl.Image_URL}${pdf.pdf_path}`}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <PictureAsPdf
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '8px',
                                        color: '#f44336'
                                      }}
                                    />
                                    {`PDF ${index + 1}`}
                                  </div>
                                </MenuItem>
                              ) : null
                            )}
                          </Select>
                        ) : (
                          <Typography
                            key={logIndex}
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontStyle: 'italic', marginBottom: '8px' }}
                          >
                            No PDFs Available
                          </Typography>
                        )
                      )
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        No Business Ideas Available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
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
    </>
  );
};
export default SpecifiQuestions;
