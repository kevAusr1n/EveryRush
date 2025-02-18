import { ReactNode } from "react";

function DisplayTable(props: {
    tableHead: string[], 
    tableContent: ReactNode[][]
}) {
    return (
        <table className="table-fixed w-300 text-center">
            <thead>
                <tr className="border-b border-gray-400 text-2xl">
                    {props.tableHead.map((value: string, index: number) => {
                        return <th key={index} className="p-5">{value}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.tableContent.map((tableRow : ReactNode[], rowIndex : number) => {
                    return (
                        <tr key={rowIndex} className="border-b border-gray-400">
                            {tableRow.map((value: ReactNode, colIndex : number) => {
                                return (<td key={(rowIndex + 1) * (colIndex + 1)} className="h-50">
                                    {value}
                                </td>)
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default DisplayTable;