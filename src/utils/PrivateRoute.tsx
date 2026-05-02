import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useValidateUserAccess } from '@/services/Authentication/AuthenticationService';
import { useEffect, useState } from 'react';
import { decodeFromBase64 } from './Helpers';
import { Show } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const { validateUserAccess, data: validateUserAccessData, loading: validationLoading } = useValidateUserAccess();
    const [validationChecked, setValidationChecked] = useState<boolean>(false);
    const [value] = useState<number>(parseInt(decodeFromBase64(params.value)));
    const [module] = useState<string>(decodeFromBase64(params.module).toString());

    useEffect(() => {
        if (!module || isNaN(value)) goToLogin(); 

        let validateModule = module;
        if (!user && validateModule == 'OwnProfile') validateModule = "VisitProfile";
        
        if (!validationChecked) {        
            validateUserAccess({value: value, module: validateModule})
            .then(() => setValidationChecked(true))
            .catch(err => {
                console.error("Validation failed:", err);
                setValidationChecked(true);
            });
        }
    }, [value, module, validationChecked, validateUserAccess]);

    useEffect(() => {
        if(validateUserAccessData && validateUserAccessData?.validateUserAccess.validate == false){
            navigate(`/NotFound`);
        }
    }, [validateUserAccessData]);

    const goToLogin = () => {
        return <Navigate to="/SignIn" replace />;
    }

    return (
        <Show 
            when={!validationLoading && validationChecked}
        >
            <Outlet />
        </Show>
    );
};

export default PrivateRoute;
