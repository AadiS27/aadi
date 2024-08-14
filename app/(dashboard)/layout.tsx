import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getAPIUsage } from "@/lib/api-limit";

const DashboardLayout=async({
    children
}:{
    children:React.ReactNode
})=>{

    const ApiLimitCount=await getAPIUsage();

    return(
        <div className="h-full relative">
         <div className="hidden h-full md:flex
           md:w-72 md:flex-col md:fixed
           md:inset-y-0 z-[80] bg-gray-900">
            <Sidebar apiLimitCount={ApiLimitCount} />
         </div>
         <main className="md:pl-72">
        <Navbar />
        {children}
         </main>
        </div>
    )
}

export default DashboardLayout;