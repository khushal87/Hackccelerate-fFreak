import { createContext, useContext } from 'react';

//Auth Context
export const ClientContext = createContext({
    token: null,
    setToken: (data) => { },
    data:null,
    setData:(data)=>{},
    userId:null,
    setUserId:(data)=>{}
});

//Use Auth Context
export function useClientContext() {
    return useContext(ClientContext);
}