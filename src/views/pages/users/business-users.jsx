import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiDelete, apiGet, apiPost, apiPut } from "../../../services/useAuth";
import apiurl from 'constant/apiurl';
/* Marerial UI */ 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from "@mui/material/TablePagination";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
// Icons
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
//Loading
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
/*popup*/
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const BusinessUsers = () => {
    const token = localStorage.getItem("token");
    //Loading states
    const [tableLoading, setTableLoading] = useState();
    const [countLoader, setCountLoader] = useState();
    const [formLoading, setFormLoading] = useState();
    const [deleteLoading, setDeleteLoading] = useState();
    //Pagination States
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5); 
    const [totalCount, setTotalCount] = useState(0);
    //Data States
    const [APIdata, setAPIdata] = useState([]);
    const [AllBusinssOnly, setBusinessOnly] = useState([]);
    const [AllBusinessUsers, setBusinessUsers] = useState([]);
    const [singleData, setSingleData] = useState();
    const [business_categories, setBusinessCategories] = useState([]);
    const [business_cats, setCategories] = useState([]);
    // Modal States
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    //delete user
    const [delconfirmModalOpen, setdelconfirmModalOpen] = useState(false);
    const [userIdtoDelete, setUserIdtoDel] = useState(null);
    const handleDeleteUser = (id) => {
        setUserIdtoDel(id);
        setdelconfirmModalOpen(true);
    }

    const [EditFormLoading, setEditFormLoading] = useState(false);
    const handleOpen = () => {
        reset();
        setIsOpenModal(true)
    };
    const handleClose = () => {
        setIsOpenModal(false);
        setIsEditModal(false);
        reset();
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const style = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', borderRadius: '10px', boxShadow: 24, p: 3, };

    const getAllBusiness = async () => {
        try{
            const URL = `${apiurl.API_URL}business`;
            const params = {};
            const response = await apiGet(URL, params, token);
            setBusinessOnly(response.data.payload.records);
        }catch( error ){
            console.error("Error fetching users:", error);
        }
    }

    const getBusinessUsersOnly = async () => {
        setTableLoading(true);
        try{
            const URL = `${apiurl.API_URL}user`;
            const params = {
                role_id: 3,
                page : page + 1,
                limit: pageSize
            };
            const response = await apiGet(URL, params, token);
            //console.log(response.data.payload.records, " Business Users List");
            setBusinessUsers(response.data.payload.records);
            setTotalCount(response.data.payload.totalRecords);
        }catch(error){
            setTableLoading(false);
            console.error("Error fetch users: ", error);
        } finally{
            setTableLoading(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const URL = `${apiurl.API_URL}category`;
            const params = {};
            const response = await apiGet(URL, params, token); 
            setCategories(response.data.payload.records);
        } catch (error) {
            console.error("Error fetching users:", error); 
        }
    };

    const createNewUsers = async (usdata) => { 
        if (!usdata) {
            console.error("User data is undefined");
            setFormLoading(false);
            return;
        }
        try {
            const URL = `${apiurl.API_URL}user`;
            const params = {
                name: usdata.name,
                email: usdata.email,
                role_id: usdata.role_id,
                password: usdata.password,
                number: usdata.number,
                city: usdata.city,
                country: usdata.country,
                state: usdata.state,
                postal_code: usdata.postal_code,
                business_name: usdata.business_name, 
                business_address: usdata.business_address,
                business_phone: usdata.business_phone, 
                business_categories: usdata.business_categories,
                business_website: usdata.business_website
            };
            const response = await apiPost(URL, params, token);
            if (response && response.usdata && response.usdata.payload) {
                setAPIdata(response.usdata.payload.records);
            } else {
                console.error("Unexpected response structure:", response);
            }
            reset();
        } catch (error) {
            setFormLoading(false);
            console.error("Error fetching users:", error);
        } finally{
            setFormLoading(false);
            handleClose();
        }
    };

    useEffect(() => {
        getBusinessUsersOnly();
    }, [page, pageSize]);

    const getBusUserSingle = async (id) => {
        try {
            const URL = `${apiurl.API_URL}user/${id}`;
            const params = {};
            const response = await apiGet(URL, params, token);
            //setBusSndata(response.data.payload.records); 
            if( response && response.success ){
                const SnUserData = response.data.payload;
                setSingleData(SnUserData);
                editSetValue("id", SnUserData.id);
                editSetValue("name", SnUserData.name);
                editSetValue("email", SnUserData.email);
                editSetValue("role_id", SnUserData.role_id);
                editSetValue("password", SnUserData.password);
                editSetValue("number", SnUserData.number);
                editSetValue("city", SnUserData.city);
                editSetValue("country", SnUserData.country);
                editSetValue("state", SnUserData.state);
                editSetValue("postal_code", SnUserData.postal_code);
                editSetValue("business_name", SnUserData.business?.name);
                editSetValue("business_address", SnUserData.business?.address);
                editSetValue("business_phone", SnUserData.business?.phone);
                editSetValue("business_categories", SnUserData.business_categories);
                editSetValue("business_website", SnUserData.business?.website);
                setIsEditModal(true);
            } else{
                console.error("User data not found or response structure is incorrect.");
            }
        } catch (error) {
            console.error("Error: User fetching data.", error);
        } finally {
            setEditFormLoading(false);
        }
    }

    const {
        register: editRegister,
        handleSubmit: editHandleSubmit,
        setValue: editSetValue,
        formState: { errors: editFormsError = {} },
    } = useForm({
        defaultValues: {
            id: singleData?.id || "",
            name: singleData?.name || "",
            email: singleData?.email || "",
            role_id: singleData?.role_id || "",
            password: singleData?.password || "",
            number: singleData?.number || "",
            city: singleData?.city || "",
            country: singleData?.country || "",
            state: singleData?.state || "",
            postal_code: singleData?.postal_code || "",
            business_name: singleData?.business_name || "",
            business_address: singleData?.business_address || "",
            business_categories: singleData?.business_categories || "",
            business_website: singleData?.business_website || "",
            business_phone: singleData?.business_phone || ""
        },
    });

    const editBusinessUser = async (upBusUser) => {
        setFormLoading(true);
        try {
            const URL = `${apiurl.API_URL}user/${upBusUser.id}`;
            const params = {
                id: upBusUser?.id,
                name: upBusUser?.name, 
                email: upBusUser?.email,
                role: upBusUser?.role_id,
                password: upBusUser?.password,
                number: upBusUser?.number,
                city: upBusUser?.city,
                country: upBusUser?.country,
                state: upBusUser?.state,
                postal_code: upBusUser?.postal_code,
                business_name: upBusUser?.business_name,
                business_address: upBusUser?.business_address,
                business_phone: upBusUser?.business_phone,
                business_categories: upBusUser?.business_categories,
                business_website: upBusUser?.business_website
            }
            const response = await apiPut(URL, params, token);
            if( response.success ){
                setIsEditModal(false);
                getBusinessUsersOnly();
            }
        } catch (error) {
            console.error('Error Edit user data:', error);
        } finally {
            setFormLoading(false);
        }
    }

    const delBusinessUser = async () => {
        if( !userIdtoDelete || !token ){
          return;
        }
        try {
          setDeleteLoading(true);
          const url = `${apiurl.API_URL}user/${userIdtoDelete}`;
          const response = await apiDelete(url, token);
          getBusinessUsersOnly();
        } catch (error) {
          console.error("Error deleting user:", error);
        } finally {
          setDeleteLoading(false);
          setdelconfirmModalOpen(false);
          setUserIdtoDel(null);
        }
    }    



    useEffect(() => {
        getAllBusiness();
        fetchCategories();
    }, []); 

    return(
        <>  
            <Typography align="right" sx={{ mb: '15px' }}>
                {/* <Button startIcon={<AddIcon />} variant="contained" onClick={() => { reset(); setIsOpenModal(true); }}>Add New User</Button> */}
                <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpen}>Add New Business User</Button>
            </Typography>
            <TableContainer component={Paper}>
                {tableLoading && <LinearProgress />}
                <Table sx={{ minWidth: 650 }} aria-label="Business Users">
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {AllBusinessUsers.length > 0 ? (
                            AllBusinessUsers.map((data) => (
                                <TableRow key={data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{data.id}</TableCell>
                                    <TableCell>{data?.name}</TableCell>
                                    <TableCell>{data?.email}</TableCell>
                                    <TableCell>{data?.roles?.name}</TableCell>
                                    <TableCell sx={{ textTransform: "capitalize" }}>{data?.status}</TableCell>
                                    <TableCell>
                                        <IconButton aria-label="Edit" color="primary" onClick={() => { getBusUserSingle(data.id); setIsEditModal(true); }}>
                                        <EditIcon />
                                        </IconButton> | <IconButton color="error" onClick={() => handleDeleteUser(data?.id)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                        <TableRow>
                        <TableCell colSpan={4} align="center">No data found</TableCell>
                        </TableRow>
                        )}    
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
                    setCountLoader(true);
                }} 
                onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 10));
                    setPage(0);
                    setCountLoader(true);
                }}
            />

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpenModal}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpenModal}>
                    <Box component="" sx={{ ...style, '& .MuiTextField-root': { m: 1, width: '47%' } }} noValidate autoComplete="off">
                        <Grid container rowSpacing={1} sx={{ alignItems: "center" }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6} style={{ paddingTop: 0 }}><h3 style={{ margin: 0 }}>Add New User</h3></Grid>
                        <Grid item xs={6} style={{ paddingTop: 0 }} textAlign={'right'}><IconButton  color="secondary" aria-label="Close" onClick={handleClose}><HighlightOffIcon /></IconButton></Grid>
                        </Grid>
                        <div className="createForm">
                            <form onSubmit={handleSubmit((data) => {createNewUsers(data)})}>
                                <div className="row">
                                    <TextField 
                                        id="name" 
                                        size="small" 
                                        label="Full Name" 
                                        {...register("name", { required: true })} 
                                        variant="outlined" 
                                        placeholder="John Doe" 
                                        error={!!errors.name} 
                                        helperText={errors.name ? "Name is required" : ""} 
                                    />
                                    <TextField 
                                        id="email" 
                                        size="small" 
                                        label="Email" 
                                        variant="outlined" 
                                        placeholder="email@email.com"
                                        {...register("email", { required: true })} 
                                        error={!!errors.email} 
                                        helperText={errors.email ? "Email is required" : ""} 
                                    />
                                </div>
                                <div className="row">  
                                    <TextField 
                                        id="password" 
                                        size="small" 
                                        type="password"
                                        label="Password" 
                                        variant="outlined"
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        {...register("password", { required: true })} 
                                        error={!!errors.password} 
                                        helperText={errors.password ? "Password is required" : ""} 
                                    />
                                    <TextField 
                                        id="number" 
                                        size="small" 
                                        label="Phone Number" 
                                        variant="outlined" 
                                        placeholder="1234567890"
                                        {...register("number", { required: true })} 
                                        error={!!errors.number} 
                                        helperText={errors.number ? "Phone Number is required" : ""} 
                                    /> 
                                </div>
                                <div className="row">
                                    <TextField 
                                        id="country" 
                                        size="small" 
                                        label="Country" 
                                        variant="outlined" 
                                        placeholder="country"
                                        {...register("country", { required: true })} 
                                        error={!!errors.country} 
                                        helperText={errors.country ? "Country name is required" : ""} 
                                    /> 
                                    <TextField 
                                        id="city" 
                                        size="small" 
                                        label="City" 
                                        variant="outlined" 
                                        placeholder="City"
                                        {...register("city", { required: true })} 
                                        error={!!errors.city} 
                                        helperText={errors.city ? "City name is required" : ""} 
                                    />
                                </div>
                                <div className="row">
                                    <TextField 
                                        id="state" 
                                        size="small" 
                                        label="State" 
                                        variant="outlined" 
                                        placeholder="State"
                                        {...register("state", { required: true })} 
                                        error={!!errors.state} 
                                        helperText={errors.state ? "State name is required" : ""} 
                                    />
                                    <TextField 
                                        id="postal_code" 
                                        size="small" 
                                        label="Postal code" 
                                        variant="outlined" 
                                        placeholder="Postal code"
                                        {...register("postal_code", { required: true })} 
                                        error={!!errors.postal_code} 
                                        helperText={errors.postal_code ? "postal code is required" : ""} 
                                    />
                                </div> 
                                <div className="row">
                                <TextField
                                    id="role_id"
                                    size="small"
                                    select
                                    label="User Role"
                                    placeholder="Select user role"
                                    {...register("role_id", { required: true })} 
                                    error={!!errors.role_id}
                                    defaultValue="3"
                                    helperText={errors.role_id ? "User role is required" : ""} 
                                    onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    editSetValue("role_id", e.target.value);
                                    }}
                                >
                                    <MenuItem value={'3'}>Business</MenuItem>               
                                </TextField>                                
                                </div>
                                <div className="businessFields">
                                    <div className="row">
                                        <TextField 
                                            id="business_name" 
                                            size="small" 
                                            label="Business Name" 
                                            {...register("business_name", { required: true })} 
                                            variant="outlined" 
                                            placeholder="Business Name" 
                                            error={!!errors.business_name} 
                                            helperText={errors.business_name ? "Business Name is required" : ""} 
                                        />
                                        <TextField 
                                            id="business_address" 
                                            size="small" 
                                            label="Business Address" 
                                            variant="outlined" 
                                            placeholder="Business address"
                                            {...register("business_address", { required: true })} 
                                            error={!!errors.business_address} 
                                            helperText={errors.business_address ? "Business Address is required" : ""} 
                                        />
                                    </div>
                                    <div className="row">
                                        <TextField 
                                            id="business_phone" 
                                            size="small" 
                                            label="Business Phone" 
                                            variant="outlined" 
                                            placeholder="1234567890"
                                            {...register("business_phone", { required: true })} 
                                            error={!!errors.business_phone} 
                                            helperText={errors.business_phone ? "Business Phone number is required" : ""} 
                                        /> 
                                        <TextField 
                                            id="business_website" 
                                            size="small" 
                                            label="Business Website" 
                                            variant="outlined" 
                                            placeholder="example.com"
                                            {...register("business_website", { required: true })} 
                                            error={!!errors.business_website} 
                                            helperText={errors.business_website ? "Business website is required" : ""} 
                                        />
                                    </div>
                                    <div className="row">
                                        <TextField
                                            sx={{ m: 1, width: '25ch' }}
                                            id="business_categories"
                                            size="small"
                                            select
                                            label="Business Category"
                                            placeholder="Select Business Category"
                                            {...register("business_categories", { required: true })} 
                                            error={!!errors.business_categories} 
                                            helperText={errors.business_categories ? "At least one category is required" : ""}
                                            SelectProps={{
                                                multiple: true
                                            }} 
                                            value={business_categories}
                                            onChange={(event) => {
                                                const {
                                                target: { value },
                                                } = event;
                                                setBusinessCategories(typeof value === 'string' ? value.split(',') : value); // Update state with selected values
                                            }}
                                            > 
                                            {business_cats.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                            ))}                
                                        </TextField>
                                    </div>
                                </div>
                                <div>
                                <Button type="submit" variant="contained" style={{ marginTop: '10px', marginLeft: '10px', width: '30%' }} disabled={formLoading} endIcon={<SendIcon />}>{formLoading ? <CircularProgress size={24} /> : 'Submit'}</Button>
                                </div>
                            </form>  
                        </div>
                    </Box>
                </Fade>
            </Modal>    

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isEditModal}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                    },
                }}
            >
                <Fade in={isEditModal}>
                    <Box component="" sx={{ ...style, '& .MuiTextField-root': { m: 1, width: '47%' } }} noValidate autoComplete="off">
                        {EditFormLoading && (
                            <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                                <CircularProgress />
                            </div>  
                        )}
                        <Grid container rowSpacing={1} sx={{ alignItems: "center" }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6} style={{ paddingTop: 0 }}><h3 style={{ margin: 0 }}>Add User</h3></Grid>
                        <Grid item xs={6} style={{ paddingTop: 0 }} textAlign={'right'}><IconButton  color="secondary" aria-label="Close" onClick={handleClose}><HighlightOffIcon /></IconButton></Grid>
                        </Grid>
                        <form onSubmit={editHandleSubmit((data) => {editBusinessUser(data)})}>
                            <div id={singleData?.id} className="row">
                                <TextField 
                                    id="name" 
                                    size="small" 
                                    label="Full Name" 
                                    {...editRegister("name", { required: true })} 
                                    defaultValue={singleData?.name || ""}
                                    variant="outlined"
                                    error={!!editFormsError.name} 
                                    helperText={editFormsError.name ? "Name is required" : ""} 
                                />
                                <TextField 
                                    id="email" 
                                    size="small" 
                                    label="Email" 
                                    variant="outlined" 
                                    defaultValue={singleData?.email || ""}
                                    {...editRegister("email", { required: true })} 
                                    error={!!editFormsError.email} 
                                    helperText={editFormsError.email ? "Email is required" : ""} 
                                />
                            </div>
                            <div className="row">  
                                <TextField 
                                    id="password" 
                                    size="small" 
                                    type="password"
                                    label="Password" 
                                    variant="outlined" 
                                    defaultValue={singleData?.password || ""}
                                    autoComplete="current-password"
                                    {...editRegister("password", { required: false })}
                                />
                                <TextField 
                                    id="number" 
                                    size="small" 
                                    label="Phone Number" 
                                    variant="outlined" 
                                    {...editRegister("number", { required: true })} 
                                    defaultValue={singleData?.number || ""}
                                    error={!!editFormsError.number} 
                                    helperText={editFormsError.number ? "Phone Number is required" : ""} 
                                /> 
                            </div>
                            <div className="row">
                                <TextField 
                                    id="country" 
                                    size="small" 
                                    label="Country" 
                                    variant="outlined" 
                                    {...editRegister("country", { required: true })}
                                    defaultValue={singleData?.country || ""} 
                                    error={!!editFormsError.country} 
                                    helperText={editFormsError.country ? "Country name is required" : ""} 
                                /> 
                                <TextField 
                                    id="city" 
                                    size="small" 
                                    label="City" 
                                    variant="outlined" 
                                    {...editRegister("city", { required: true })} 
                                    defaultValue={singleData?.city || ""}
                                    error={!!editFormsError.city} 
                                    helperText={editFormsError.city ? "City name is required" : ""} 
                                />
                            </div>
                            <div className="row">
                                <TextField 
                                    id="state" 
                                    size="small" 
                                    label="State" 
                                    variant="outlined" 
                                    {...editRegister("state", { required: true })} 
                                    defaultValue={singleData?.state || ""}
                                    error={!!editFormsError.state} 
                                    helperText={editFormsError.state ? "State name is required" : ""} 
                                />
                                <TextField 
                                    id="postal_code" 
                                    size="small" 
                                    label="Postal code" 
                                    variant="outlined" 
                                    {...editRegister("postal_code", { required: true })} 
                                    defaultValue={singleData?.postal_code || ""}
                                    error={!!editFormsError.postal_code} 
                                    helperText={editFormsError.postal_code ? "postal code is required" : ""} 
                                />
                            </div>
                            <div className="row">
                                <TextField
                                    id="role_id"
                                    size="small"
                                    select
                                    label="User Role"
                                    placeholder="Select user role"
                                    {...editRegister("role_id", { required: true })} 
                                    error={!!editFormsError.role_id} 
                                    helperText={editFormsError.role_id ? "User role is required" : ""} 
                                    onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    editSetValue("role_id", e.target.value);
                                    }}
                                    value={singleData?.role_id || ""} 
                                >
                                    <MenuItem value={'3'}>Business</MenuItem>               
                                </TextField>
                            </div>    
                            <div className="businessFields">
                                <h4 style={{ marginBottom: '5px', paddingLeft: '10px' }}>Business Fields</h4>
                                <div className="row">
                                    <TextField 
                                        id="business_name" 
                                        size="small" 
                                        label="Business Name" 
                                        {...editRegister("business_name", { required: true })} 
                                        defaultValue={singleData?.business?.name || ""}
                                        variant="outlined" 
                                        placeholder="Business Name" 
                                        error={!!editFormsError.business_name} 
                                        helperText={editFormsError.business_name ? "Business Name is required" : ""} 
                                    />
                                    <TextField 
                                        id="business_address" 
                                        size="small" 
                                        label="Business Address" 
                                        variant="outlined" 
                                        placeholder="Business address"
                                        {...editRegister("business_address", { required: true })} 
                                        defaultValue={singleData?.business?.address || ""}
                                        error={!!editFormsError.business_address} 
                                        helperText={editFormsError.business_address ? "Business Address is required" : ""} 
                                    />
                                </div>
                                <div className="row">
                                    <TextField 
                                        id="business_phone" 
                                        size="small" 
                                        label="Business Phone" 
                                        variant="outlined" 
                                        placeholder="1234567890"
                                        {...editRegister("business_phone", { required: true })} 
                                        defaultValue={singleData?.business?.phone || ""}
                                        error={!!editFormsError.business_phone} 
                                        helperText={editFormsError.business_phone ? "Business Phone number is required" : ""} 
                                    /> 
                                    <TextField 
                                        id="business_website" 
                                        size="small" 
                                        label="Business Website" 
                                        variant="outlined" 
                                        placeholder="example.com"
                                        {...editRegister("business_website", { required: true })} 
                                        defaultValue={singleData?.business?.website || ""}
                                        error={!!editFormsError.business_website} 
                                        helperText={editFormsError.business_website ? "Business website is required" : ""} 
                                    />
                                </div>
                                <div className="row">
                                    <TextField
                                        sx={{ m: 1, width: '25ch' }}
                                        id="business_categories"
                                        size="small"
                                        select
                                        label="Business Category"
                                        placeholder="Select Business Category"
                                        {...editRegister("business_categories", { required: true })} 
                                        error={!!editFormsError.business_categories} 
                                        helperText={editFormsError.business_categories ? "At least one category is required" : ""}
                                        SelectProps={{
                                            multiple: true
                                        }} 
                                        value={business_categories}
                                        onChange={(event) => {
                                            const {
                                            target: { value },
                                            } = event;
                                            setBusinessCategories(typeof value === 'string' ? value.split(',') : value); // Update state with selected values
                                        }}
                                        > 
                                        {business_cats.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                        ))}                
                                    </TextField>
                                </div>
                            </div> 
                            <div>
                                <Button type="submit" variant="contained" style={{ marginTop: '10px', marginLeft: '10px', width: '30%' }} disabled={formLoading} endIcon={<SendIcon />}>{formLoading ? <CircularProgress size={24} /> : 'Update'}</Button>
                                {/* <button type="submit">Submit</button> */}
                            </div>
                        </form>
                    </Box>  
                </Fade>
            </Modal> 
            
            <Modal
                aria-labelledby="confirm-delete-modal-title"
                aria-describedby="confirm-delete-modal-description"
                open={delconfirmModalOpen}
                onClose={() => setdelconfirmModalOpen(false)}
            >
                <Box sx={style}>
                    <h2>Confirm Deletion</h2>
                    <p>Are you sure you want to delete this user?</p>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={delBusinessUser} variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                        <Button onClick={() => setdelconfirmModalOpen(false)} variant="contained" startIcon={<CloseIcon />}> Cancel</Button>
                    </Stack>
                </Box>
            </Modal>

        </>
    );    

}
export default BusinessUsers;