import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SchoolInterface from "../models/school";
import UserInterface from "../models/user";
import { helperService } from "../services";
import api from "../services/api";
import { UserType } from "../utils/enums";

export default function useUser(session:Session | null){
    const [user, setUser] = useState<UserInterface>();
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if(session && !user){
            api.getUsers().then(({data:{data}}:any) => {
                const user = (data as UserInterface[]).find(user => user.email == session?.user?.email)
                setUser(s => user); 
                setIsAdmin(s => user?.type===UserType.ADMIN)
            })
        }
    }, [session])

    return {isAdmin,user};
}