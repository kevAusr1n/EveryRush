class ProductStatusConfig {
    static readonly IN_SALE = 0;
    static readonly OUT_OF_STOCK = 1;
    static readonly OFF_SHELF = 2;

    static getStatusName(status: number) {
        switch (status) {
            case ProductStatusConfig.IN_SALE:
                return 'In Sale';
            case ProductStatusConfig.OUT_OF_STOCK:
                return 'Out of Stock';
            case ProductStatusConfig.OFF_SHELF:
                return 'Off Shelf';
        }
    }
}

export default ProductStatusConfig;