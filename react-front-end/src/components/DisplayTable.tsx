import { JSX, ReactNode } from "react";

function DisplayTable(props: {
    head: string[], 
    nodeMatrix: ReactNode[][]
}) {
    return (
        <table className="table-auto w-200 h-100 text-right">
            <thead>
                <tr className="border-b border-gray-400">
                    {props.head.map((value: string, index: number) => {
                        return <th key={index}>{value}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.nodeMatrix.map((nodeRows : ReactNode[], row_index : number) => {
                    return (
                        <tr key={row_index} className="border-b border-gray-400">
                            {nodeRows.map((node: ReactNode, col_index : number) => {
                                return (<td key={(row_index + 1) * (col_index + 1)}>
                                    {node}
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