import prisma from '../prisma/prismaClient';

export const createProduct = async (productData: any) => {
    try {

        const {
            productName,
            averagePrice,
            goodPrice,
            highPrice,
            description,
            sellerId,
        } = productData;

        // Check if Supplier exists
        const supplierExists = await prisma.seller.findUnique({
            where: { id: sellerId },
        });

        if (!supplierExists) {
            throw new Error(`Supplier with ID ${sellerId} does not exist.`);
        }

        const product = await prisma.product.create({
            data: {
                productName,
                averagePrice,
                goodPrice,
                highPrice,
                description,
                sellerId,
            },
        });

        return { message: 'Product added successfully', data: product };

    } catch (error) {
        console.error('Error adding product to database:', error);
        throw new Error('Failed to add product');
    }
};

export const getProductList = async (seller: any) => {
    try {

        const {
            sellerId,
        } = seller;

        // Check if Supplier exists
        const supplierExists = await prisma.seller.findUnique({
            where: { id: sellerId },
        });

        if (!supplierExists) {
            throw new Error(`Supplier with ID ${sellerId} does not exist.`);
        }

        const productList = await prisma.product.findMany({
            where: { sellerId: sellerId },
        });

        return { message: 'Got Product List successfully', data: productList };

    } catch (error) {
        console.error('Error Getting Product List database:', error);
        throw new Error('Failed to get product List');
    }
};

export const updateProduct = async (productData: any) => {
    try {
      const {
        id,
        productName,
        averagePrice,
        goodPrice,
        highPrice,
        description,
      } = productData;
  
      // Check if the product exists
      const productExists = await prisma.product.findUnique({
        where: { id: id },
      });
  
      if (!productExists) {
        throw new Error(`Product with ID ${id} does not exist.`);
      }
  
      // Update the product with the new data
      const updatedData = await prisma.product.update({
        where: { id: id },  // Specify the product to be updated by its ID
        data: {
          productName,
          averagePrice,
          goodPrice,
          highPrice,
          description,
        },
      });
  
      return { message: 'Product updated successfully', data: updatedData };
    } catch (error) {
      console.error('Error updating product in database:', error);
      throw new Error('Failed to update product');
    }
  };

  export const getLowestPriceProductList = async (product: any) => {
    try {
        const { productName } = product;

        if (!productName) {
            throw new Error('Product name is required.');
        }

        // Fetch the product list with a LIKE query and filter for lowest prices
        const productList = await prisma.product.findMany({
            where: {
                productName: {
                    contains: productName, // Matches productName partially (LIKE '%productName%')
                    mode: 'insensitive',  // Case-insensitive match
                },
            },
            orderBy: {
                goodPrice: 'asc', // Order by the lowest goodPrice first
            },
            take: 5, // Limit the results to 5 products
        });

        return { message: 'Got Product List successfully', data: productList };
    } catch (error) {
        console.error('Error Getting Product List from the database:', error);
        throw new Error('Failed to get product list.');
    }
};

  