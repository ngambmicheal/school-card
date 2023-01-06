import { UseToastOptions } from "@chakra-ui/react";

export function errorMessage(message:string): UseToastOptions{
    return { position:'top-right', title:'Error Occured',  description: message, status:'error'}
}

export function successMessage(message:string): UseToastOptions{
    return { position:'top-right', title:'Success',  description: message, status:'success'}
}

export function infoMessage(message:string): UseToastOptions{
    return { position:'top-right', title:'Warning!',  description: message, status:'info'}
}