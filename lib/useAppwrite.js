import { useState, useEffect } from 'react'
import { useGlobalContext } from '../context/GlobalProvider';

/** Custom hook for calling Appwrite API **/

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { flashMessage } = useGlobalContext();

    const fetchData = async () => {
        setIsLoading(true)

        try {
            const response = await fn();

            setData(response);
        } catch (error) {
            return flashMessage.current.showMessage({
                message: error.message,
                type: "danger",
                duration: 5000
            });
        } finally {
            setIsLoading(false)
        }
    }
  
    useEffect(() => {
        fetchData();
    }, [])

    const refetch = () => fetchData();

    return { data, isLoading, refetch }
}

export default useAppwrite