import { Dispatch, SetStateAction, useState } from "react";
import { BlackButton, RedButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import ProductStatusConfig from "../config/ProductStatusConfig";
import { deleteProducts, updateProductStatus, updateProductStock } from "../functions/ProductFunction";
import { Product } from "../type/EntityType";

function ProductUpdateblePage(props: {product: Product, refresh: boolean, setRefresh: Dispatch<SetStateAction<boolean>>}) {
    const [stock, setStock] = useState(props.product.stock);
    const [stockChangeMsg, setStockChangeMsg] = useState("");
    const [edit, setEdit] = useState(false);
    
    const changeStock = (value: string) => {
        if (Number.isNaN(Number(value))) {
            setStockChangeMsg("not number");
        } else {
            setStockChangeMsg("");
            setStock(Number(value));
        }
    }

    const updateProductStatusHandler = async (id: string, status: number) => {
        await updateProductStatus({id: id, status: status});
        props.setRefresh(!props.refresh);
    }

    const updateProductStockHandler = async (id: string) => {
        await updateProductStock({id: id, stock: stock});
        setEdit(false);
        props.setRefresh(!props.refresh);
    }

    const deleteProductHandler = async (id: string) => {
        await deleteProducts({id: id});
        props.setRefresh(!props.refresh);
    }

    return (                   
        <ResponsiveDiv style="w-full flex flex-row shadow-xl items-center px-2" children={[
            <a className="w-3/13 text-blue-500 underline" key={0} href={`/product/${props.product.id}`}>{props.product.id}</a>,
            <p className="w-3/13" key={1}>{props.product.name}</p>,
            <p className="w-1/13" key={2}>${props.product.price}</p>,
            <ResponsiveDiv style="w-2/13 flex flex-row gap-2 items-center" children={[
                !edit && <p className="w-1/4" key={3}>{props.product.stock}</p>,
                !edit && <WhiteButton buttonName="UPDATE" size="w-25 h-10" clickHandler={() => {
                    setEdit(true);
                }} />,
                edit && <input className="w-1/4 border-1" type="text" defaultValue={props.product.stock} onChange={(e) => {
                    changeStock(e.target.value);
                }} />,
                edit && <BlackButton buttonName="Y" size="w-10 h-10" clickHandler={() => {
                    updateProductStockHandler(props.product.id)
                }} />,
                edit && <RedButton buttonName="N" size="w-10 h-10" clickHandler={() => {
                    setStockChangeMsg("");
                    setEdit(false);
                }} />,
                edit && <p className="text-red-500">{stockChangeMsg}</p>
            ]} />,
            <p className="w-1/13" key={4}>{ProductStatusConfig.getStatusName(props.product.status)}</p>,
            <ResponsiveDiv style="flex flex-row gap-2 py-3" children={[
                props.product.status == ProductStatusConfig.OFF_SHELF && <BlackButton buttonName="ON-SHELF" size="w-40 h-10" clickHandler={() => {
                    updateProductStatusHandler(props.product.id, ProductStatusConfig.IN_SALE);
                }} />,
                props.product.status != ProductStatusConfig.OFF_SHELF && <BlackButton buttonName="OFF-SHELF" size="w-40 h-10" clickHandler={() => {
                    updateProductStatusHandler(props.product.id, ProductStatusConfig.OFF_SHELF);
                }} />,
                <RedButton buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                    deleteProductHandler(props.product.id);
                }} />
            ]} />
        ]} />                    
    )
}

export default ProductUpdateblePage;