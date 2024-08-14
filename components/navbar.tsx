
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { checkApiLimit, getAPIUsage } from "@/lib/api-limit";

const Navbar=async()=>{
    const apiLimitCount=await getAPIUsage();
    return(
        <div className="flex items-center p-4">
            <MobileSidebar apiLimitCount={apiLimitCount} />
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    )
}

export default Navbar;