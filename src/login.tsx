import React, { useState } from 'react'
import {
    Grid,
    TextField,
    Button,
    makeStyles,
    createStyles,
    Theme,
} from '@material-ui/core'
import { Formik, Form, FormikProps } from 'formik'
import * as Yup from 'yup'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '450px',
            display: 'block',
            margin: '0 auto',
        },
        textField: {
            '& > *': {
                width: '100%',
            },
        },
        submitButton: {
            marginTop: '24px',
        },
        title: { textAlign: 'center' },
        successMessage: { color: 'green' },
        errorMessage: { color: 'red' },
    })
)

interface ILoginForm {
    userName: string
    password: string
   
}

interface IFormStatus {
    message: string
    type: string
}

interface IFormStatusProps {
    [key: string]: IFormStatus
}

const formStatusProps: IFormStatusProps = {
    success: {
        message: 'Signed up successfully.',
        type: 'success',
    },
    duplicate: {
        message: 'Email-id already exist. Please use different email-id.',
        type: 'error',
    },
    error: {
        message: 'Something went wrong. Please try again.',
        type: 'error',
    },
}

const Login: React.FunctionComponent = () => {
    const classes = useStyles()
    const [displayFormStatus, setDisplayFormStatus] = useState(false)
    const [formStatus, setFormStatus] = useState<IFormStatus>({
        message: '',
        type: '',
    })

    const createNewUser = async (data: ILoginForm, resetForm: Function) => {
        try {
            // API call integration will be here. Handle success / error response accordingly.
            if (data) {
                setFormStatus(formStatusProps.success)
                resetForm({})
            }
        } catch (error) {
            const response = error.response
            if (
                response.data === 'user already exist' &&
                response.status === 400
            ) {
                setFormStatus(formStatusProps.duplicate)
            } else {
                setFormStatus(formStatusProps.error)
            }
        } finally {
            setDisplayFormStatus(true)
        }
    }

    return (
        <div className={classes.root}>
            <Formik
                initialValues={{
                    userName: '',
                    password: '',
                    
                }}
                onSubmit={(values: ILoginForm, actions) => {
                    createNewUser(values, actions.resetForm)
                    setTimeout(() => {
                        actions.setSubmitting(false)
                    }, 500)
                }}
                validationSchema={Yup.object().shape({
                   
                   userName: Yup.string().required('Please enter username'),
                    password: Yup.string()
                        .matches(
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
                        )
                        .required(
                            'Please valid password. One uppercase, one lowercase, one special character and no spaces'
                        ),
                   
                })}
            >
                {(props: FormikProps<ILoginForm>) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        isSubmitting,
                    } = props
                    return (
                        <Form>
                            <h1 className={classes.title}>Login</h1>
                            <Grid
                                container
                                justify="space-around"
                                direction="row"
                            >
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="userName"
                                        id="userName"
                                        label="userName"
                                        value={values.userName}
                                        type="text"
                                        helperText={
                                            errors.userName && touched.userName
                                                ? errors.userName
                                                : 'Enter your full name.'
                                        }
                                        error={
                                            errors.userName && touched.userName
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="password"
                                        id="password"
                                        label="Password"
                                        value={values.password}
                                        type="password"
                                        helperText={
                                            errors.password && touched.password
                                                ? 'Please valid password. One uppercase, one lowercase, one special character and no spaces'
                                                : 'One uppercase, one lowercase, one special character and no spaces'
                                        }
                                        error={
                                            errors.password && touched.password
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>
                                
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.submitButton}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        disabled={isSubmitting}
                                    >
                                        LOGIN
                                    </Button>
                                    {displayFormStatus && (
                                        <div className="formStatus">
                                            {formStatus.type === 'error' ? (
                                                <p
                                                    className={
                                                        classes.errorMessage
                                                    }
                                                >
                                                    {formStatus.message}
                                                </p>
                                            ) : formStatus.type ===
                                              'success' ? (
                                                <p
                                                    className={
                                                        classes.successMessage
                                                    }
                                                >
                                                    {formStatus.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default Login;