import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';
import { apiPost } from 'services/useAuth';
import apiurl from 'constant/apiurl';
import { setStorage } from 'services/storage';
import { useNavigate, Link } from 'react-router-dom';

function ForgetPassword() {
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);
  const [otp, setOtp] = useState(false);
  const [isloadingResetPass, setIsResetPass] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isloadingCheckFtp, setIsLoadingCheckftp] = useState(false);
  const [errorOpt, setErrorOpt] = useState("");
  const [forgetEmail, setForgetEmail] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const { REACT_APP_API_URL } = process.env;

  const {
    register: registerForgotPass,
    setError,
    reset: resetForgotPass,
    formState: { errors: errorsForgotPass },
    handleSubmit: handleSubmitForGotPass,
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });
  const {
    register: registerOtpCheck,
    setError: registerOtpCheckError,
    reset: resetOtpCheck,
    setData: setDataOtp,
    formState: { errors: errorsOtpCheck },
    handleSubmit: handleSubmitOtpCheck,
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });
  const {
    register: registerResetPass,
    setError: registerResetPassError,
    reset: resetResetPass,
    watch,
    formState: { errors: errorsResetPass },
    handleSubmit: handleSubmitResetPass,
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });

  const password = useRef({});
  password.current = watch("password", "");

  const forgotPasswordSub = (data) => {
    setIsLoadingForgot(true);
    const url = `${REACT_APP_API_URL}/users/forgotPassword`;
    const params = { email: data.forgotemail };
    apiPost(url, params)
      .then((response) => {
        setIsLoadingForgot(false);
        if (response.data.code === 200) {
          NotificationManager.success(response.data.message);
          setForgetEmail(data.forgotemail);
          setTimeout(() => {
            setOtp(true);
          }, 1500);
        } else if (response.data.code === 409) {
          setError("forgotemail", { type: "manual", message: "The selected email is invalid." });
        }
      })
      .catch(() => {
        setIsLoadingForgot(false);
      });
  };
  const optValidate = () => {
    setIsLoadingCheckftp(true);
    let url = `${REACT_APP_API_URL}/users/optVerify`;
    const params = {
      email: forgetEmail,
      otp: otpValue,
    };
    apiPost(url, params)
      .then((response) => {
        setIsLoadingCheckftp(false);
        if (response.data.code === 200) {
          setTimeout(() => {
            setShowPass(true);
          }, 1500);
        } else if (response.data.code === 404) {
          setErrorOpt(response.data.message);
        } else {
        }
      })
      .catch((error) => {});
  };
  const passWordReset = (data) => {
    setIsResetPass(true);
    let url = `${REACT_APP_API_URL}/users/resetPassword`;
    const params = {
      email: forgetEmail,
      otp: otpValue,
      password: data.confirm_password,
    };
    apiPost(url, params)
      .then((response) => {
        setIsResetPass(false);
        if (response.data.code === 200) {
          NotificationManager.success(response.data.message);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else if (response.data.code === 404) {
          registerResetPassError("confirm_password", { type: "manual", message: response.data.message });
        } else {
        }
      })
      .catch((error) => {});
  };
  return (
    <div className="container formbox atrade d-flex align-items-center justify-content-center gap-2  bg-lightGray" style={{ height: "100vh" }}>
      <NotificationContainer />
      <div className="row">
        <div className="col-lg-6 col-12">
          <div className="form-logo">
            <Link to="/login">
              <img src={pbzLogo} alt="PlansBid" />
            </Link>
            {showPass ? <img src={Reset} className="d-lg-block d-none mt-2 ms-2" alt="" width="600" /> : <>{otp ? <img src={OtpImg} className="d-lg-block d-none mt-4 me-4" alt="" width="600" /> : <img src={ForgetPass} className="d-none d-lg-block mt-2 ms-4" alt="" width="500" />}</>}
          </div>
          {/*form-logo */}
        </div>
        <div className="col-lg-6 col-12 d-flex justify-content-center p-lg-5 p-md-4 p-4 bg-white mt-lg-4 mt-2 rounded-4">
          <div className="w-lg-75 w-100">
            {showPass ? (
              <div>
                <form onSubmit={handleSubmitResetPass(passWordReset)}>
                  <div className="fortydays-trails fallback-font">
                    <div className="fallback-font p-lg-4 p-0" style={{ borderRadius: "20px", lineHeight: "1", margin: "0", border: "1px solid #fff", backgroundColor: "#fff" }}>
                      <div className="single-field-login mb-1" style={{ textAlign: "left", fontSize: "15px" }}>
                        <h3 className="my-4 pt-4">Reset your password</h3>
                        <label htmlFor="password">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          style={{ fontSize: "12px" }}
                          className="form-control border border-2 mt-2 text-muted"
                          type="password"
                          placeholder="New password*"
                          {...registerResetPass("password", {
                            minLength: {
                              value: 8,
                              message: "Password must have at least 8 characters",
                            },
                            required: "This field is required!",
                          })}
                        />
                        <p className="text-danger fs-7 p-1">{errorsResetPass.password?.message}</p>
                      </div>
                      <div className="single-field-login mb-1" style={{ textAlign: "left", fontSize: "15px" }}>
                        <label htmlFor="c-password">
                          Confirm Password <span className="text-danger">*</span>
                        </label>
                        <input
                          style={{ fontSize: "12px" }}
                          className="form-control text-muted border border-2 mt-2"
                          type="password"
                          placeholder="Confirm password*"
                          {...registerResetPass("confirm_password", {
                            validate: (val) => {
                              if (val !== password.current) {
                                return "The passwords do not match";
                              }
                            },
                          })}
                        />
                        {errorsResetPass.confirm_password && <p className="text-danger fs-7 p-1">{errorsResetPass.confirm_password.message}</p>}
                      </div>
                      <button className={`btn-auth w-100 mt-4 ${isloadingResetPass ? "disable-btn" : ""}`} disabled={isloadingResetPass} type="submit">
                        {isloadingResetPass ? (
                          <span>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            &nbsp;
                          </span>
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>

                    {/* /.message-box */}
                  </div>
                </form>
              </div>
            ) : (
              <>
                {" "}
                {otp ? (
                  <div>
                    <form onSubmit={handleSubmitOtpCheck(optValidate)}>
                      <div className="">
                        <div className="fallback-font p-lg-4 p-0 " style={{ borderRadius: "20px", lineHeight: "1", margin: "0", border: "1px solid #fff", backgroundColor: "#fff" }}>
                          <div className="logo-hand" style={{ lineHeight: "0.7", textAlign: "center", margin: "0 0 8px", display: "block" }}>
                            <ReactSVG src={OtpSend} />
                          </div>
                          {/* /.logo-hand */}
                          <h3 className="text-center py-2 fallback-font">Please check your email</h3>
                          <div className="fallback-font content-a" style={{ textAlign: "center", color: "#373737", fontSize: "12px", fontWeight: "400", lineHeight: "1.4", fontFamily: "'Inter', Arial, sans-serif", margin: "0 0 px" }}>
                            We've just sent a password reset email to your inbox.
                          </div>
                          <OtpInput
                            value={otpValue}
                            onChange={(e) => {
                              setOtpValue(e);
                              setErrorOpt("");
                            }}
                            numInputs={6}
                            containerStyle={{
                              alignItems: "center",
                              marginTop: "18px",
                              justifyContent: "space-between",
                            }}
                            inputStyle={{
                              padding: "13px",
                              borderRadius: "10px",
                              borderColor: "rgba(0, 0, 0, 0.2)",
                              width: "3rem",
                              height: "3rem",
                            }}
                            renderInput={(props) => <input {...props} />}
                          />
                          <p className="text-danger fs-7 p-1">{errorOpt}</p>
                          <button className={` btn-auth w-100 mt-4 ${isloadingCheckFtp ? "disable-btn" : ""}`} disabled={isloadingCheckFtp} type="submit">
                            {isloadingCheckFtp ? (
                              <span>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                &nbsp;
                              </span>
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </div>

                        {/* /.message-box */}
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h3 className="fw-bold pb-1 pt-lg-5 pt-3">Forget Password?</h3>

                    <div>
                      <p>Enter your registered login email below to get your unique link to reset the password</p>
                    </div>
                    <form onSubmit={handleSubmitForGotPass(forgotPasswordSub)}>
                      <div className="mt-4">
                        <div className="pt-4">
                          <div className="form-group mb-3 px-1">
                            <label htmlFor="email" className="form-label">
                              Email Address
                            </label>
                            <input className="form-control text-muted border border-2 rounded-4 px-4 py-3" style={{ fontSize: "12px" }} name="forgotemail" placeholder="Enter your email address" type="email" {...registerForgotPass("forgotemail", { required: "This field is required!" })} autoComplete="off" />
                            <p className="text-danger fs-7 p-1">{errorsForgotPass.forgotemail?.message}</p>
                          </div>
                        </div>
                      </div>
                      <button className={`btn-auth w-100 ${isLoadingForgot ? "disable-btn" : ""}`} type="submit" disabled={isLoadingForgot}>
                        {isLoadingForgot ? (
                          <span>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp; Sending code...
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
            <div className="text-center pt-5">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
