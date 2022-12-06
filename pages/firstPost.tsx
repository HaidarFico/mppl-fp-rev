import Link from "next/link"
import Head from "next/head"
import { PrismaClient } from "@prisma/client"
import * as prismaFunctions from './api/userControls'

export default function firstFunction({queryObj} :any){

    // console.log(queryObj[0].P_ID);
    return(
        <>
        <h1>test123</h1>
        <h1>{queryObj.P_NAMA}</h1>
        </>
    )
}

export async function getServerSideProps(){
    const query = await prismaFunctions.loginUser('test@test123.com', 'test123');
    return {
        props:{
            queryObj: query
        }
    }
}