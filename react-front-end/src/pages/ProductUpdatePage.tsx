import { Dispatch, SetStateAction, useState } from "react";
import { RedButton, WhiteButton } from "../components/Button";
import ResponsiveDiv from "../components/div/ResponsiveDiv";
import ProductStatusConfig from "../config/ProductStatusConfig";
import { deleteProducts, updateProductStatus, updateProductStock } from "../functions/ProductFunction";
import { Product } from "../type/EntityType";
import { MonoStyleText } from "../components/Text";
import { createSearchParams, useNavigate } from "react-router";

function ProductUpdatePage(props: {product: Product, refresh: boolean, setRefresh: Dispatch<SetStateAction<boolean>>}) {    
    const navigate = useNavigate();
    const updateProductStatusHandler = async (id: string, status: number) => {
        await updateProductStatus({id: id, status: status});
        props.setRefresh(!props.refresh);
    }

    const deleteProductHandler = async (id: string) => {
        await deleteProducts({id: id});
        props.setRefresh(!props.refresh);
    }

    return (                   
        <ResponsiveDiv style="w-full flex flex-row shadow-xl items-center px-2" children={<>
            <a className="w-3/13 underline font-mono" key={0} href={`/product/${props.product.id}`}>{props.product.id}</a>
            <MonoStyleText style="w-3/13" key={1} content={props.product.name} />
            <MonoStyleText style="w-1/13" key={2} content={"$" + props.product.price} />
            <ResponsiveDiv style="w-2/13 flex flex-row gap-2 items-center" children={<>
                <MonoStyleText style="w-1/13" key={3} content={props.product.stock.toString()} />
            </>} />
            <MonoStyleText style="w-1/13" key={4} content={ProductStatusConfig.getStatusName(props.product.status) as string} />
            <ResponsiveDiv style="flex flex-row gap-2 py-3" children={<>
                {props.product.status == ProductStatusConfig.OFF_SHELF && <WhiteButton buttonName="ON-SHELF" size="w-40 h-10" clickHandler={() => {
                    updateProductStatusHandler(props.product.id, ProductStatusConfig.IN_SALE);
                }} />}
                {props.product.status != ProductStatusConfig.OFF_SHELF && <WhiteButton buttonName="OFF-SHELF" size="w-40 h-10" clickHandler={() => {
                    updateProductStatusHandler(props.product.id, ProductStatusConfig.OFF_SHELF);
                }} />}
                <WhiteButton buttonName="UPDATE" size="w-40 h-10" clickHandler={() => {
                    navigate({
                        pathname: "/products/update",
                        search: createSearchParams({
                            id: props.product.id,
                            name: props.product.name,
                            description: props.product.description,
                            imageUrl: props.product.imageUrl,
                            price: props.product.price.toString(),
                            stock: props.product.stock.toString(),
                        }).toString()
                    })
                }} />
                <RedButton buttonName="DELETE" size="w-40 h-10" clickHandler={() => {
                    deleteProductHandler(props.product.id);
                }} />
            </>} />
        </>} />                    
    )
}

export default ProductUpdatePage;