import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SchoolInterface from "../models/school";
import UserInterface from "../models/user";
import { helperService } from "../services";
import api from "../services/api";

export default function useUser(session:Session | null){
    const [user, setUser] = useState<UserInterface>();

    useEffect(() => {
        if(session && !user){
            console.log(session)
            api.getUsers().then(({data:{data}}:any) => {
                const user = (data as UserInterface[]).find(user => user.email == session?.user?.email)
                setUser(s => user); 
            })
        }
    }, [session])

    return user;
}