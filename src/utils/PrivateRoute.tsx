import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useValidateUserAccess } from '@/services/Authentication/AuthenticationService';
import { useEffect, useState } from 'react';
import { decodeFromBase64 } from './Helpers';
import { Show } from '@chakra-ui/react';

const PrivateRoute = () => {
    const { user } = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const { validateUserAccess, data: validateUserAccessData, loading: validationLoading } = useValidateUserAccess();
    const [validationChecked, setValidationChecked] = useState<boolean>(false);
    const [value] = useState<number>(parseInt(decodeFromBase64(params.value)));
    const [module] = useState<string>(decodeFromBase64(params.module).toString());

    if (!user) {
        return <Navigate to="/SignIn" replace />;
    }

    useEffect(() => {
        if (module && value && !validationChecked) {            
            validateUserAccess({value: value, module: module}).then(() => {
                setValidationChecked(true); 
            }).catch(err => {
                console.error("Validation failed:", err);
                setValidationChecked(true);
            });
        }
    }, [params.value, params.module, validationChecked, validateUserAccess]);

    useEffect(() => {
        if(validateUserAccessData && validateUserAccessData?.validateUserAccess.validate == false){
            navigate(`/NotFound`);
        }
    }, [validateUserAccessData]); 

    return (
        <Show 
            when={!validationLoading && validationChecked}
        >
            <Outlet />
        </Show>
    );
};

export default PrivateRoute;
