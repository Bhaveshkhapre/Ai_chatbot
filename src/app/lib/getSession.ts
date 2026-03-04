import { cookies } from "next/headers";
import { scalekit } from "./ScaleKit";

export async function getSession() {
    const session = await cookies()
    const token = session.get("access_Token")?.value
    if (!token) {
        return null
    }
    try {
        const result:any = await scalekit.validateToken(token)
        const user = await scalekit.user.getUser(result.sub)
        return user
        console.log(result)

    } catch (error) {
        console.log(error)
    }


} 