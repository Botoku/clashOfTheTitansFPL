import { Users } from "@/app/userList/page";
import * as XLSX from "xlsx"
export const getCategory = (category:string, checkFor:string) => {
    if(category.includes(checkFor)) return "Yes"
    else return ""
}
export const onGetExport = async (data:Users[],title?: string, worksheetname?: string) => {
   
    try {
        const dataToExport = data.map((info) => ({
            firstName: info.firstName,
            lastName: info.lastName,
            email: info.email, 
            teamName: info.fplTeam,
            general: getCategory(info.category, "general"),
            h2h: getCategory(info.category, "h2h"),
            legends: getCategory(info.category, "legends"),
            worldClass: getCategory(info.category, "worldClass"),
            phoneNumber: info.phoneNumber, 
            instagram: info.instagram,
            twitter: info.twitter, 
            linkToReceipt: info.imageUrl

        }))

          // Create Excel workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
          XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
          // Save the workbook as an Excel file
          XLSX.writeFile(workbook, `${title}.xlsx`);
          console.log(`Exported data to ${title}.xlsx`);
    } catch (error) {
        if (error instanceof Error) {
            console.log("#==================Export Error", error.message);
        } else {
            console.log("#==================Export Error", String(error));
        }
    }
}