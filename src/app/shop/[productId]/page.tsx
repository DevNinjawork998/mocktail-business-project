import { notFound } from "next/navigation";
import ProductPageWrapper from "./ProductPageWrapper";
import Navigation from "../../../components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { getProductById, getOtherProducts } from "@/data/serverProductService";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:18',message:'Fetching product by ID',data:{productId},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const product = await getProductById(productId);

    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:22',message:'Product fetch result',data:{productFound:!!product,productId,imageUrl:product?.imageUrl,imagesCount:product?.images?.length||0,images:product?.images?.map(i=>({order:i.order,url:i.url}))||[]},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (!product) {
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:25',message:'Product not found - returning 404',data:{productId},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      notFound();
    }

    const otherProducts = await getOtherProducts(productId);

    const breadcrumbItems = [
      { label: "Shop", href: "/shop" },
      { label: product.name },
    ];

    return (
      <>
        <Navigation />
        <Breadcrumb items={breadcrumbItems} />
        <ProductPageWrapper product={product} otherProducts={otherProducts} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
