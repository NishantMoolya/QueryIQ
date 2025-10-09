import { useSelector } from "react-redux";

const useRole = () => {
    const userRole = useSelector(state => state.user.role); 

    const checkRole = (role = []) => {
        if (role.includes('*')) return true;        
        else return role.includes(userRole);
    }

    return checkRole;
}

export default useRole;