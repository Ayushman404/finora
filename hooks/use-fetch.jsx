// import { useFormState } from "react-dom";
"use client";
import { toast } from "sonner";

const { useState } = require("react")

const useFetch = (cb) =>{

    const [data, setData] = useState(undefined)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fn = async(...args)=>{
        setLoading(true);
        setError(null);
        try{
            const res = await cb(...args);
            setData(res);
            setError(null);
        }catch(err){
            setError(err);
            toast.error(err.message || "Something went wrong");

        }finally{
            setLoading(false);
        }
    }

    return {data, loading, error, fn}
}
export default useFetch;